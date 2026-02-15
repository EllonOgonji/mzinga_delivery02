# priv/repo/manual_checkout_test.exs
alias MzingaDelivery.Repo
alias MzingaDelivery.Accounts
alias MzingaDelivery.Stores
alias MzingaDelivery.Products
alias MzingaDelivery.Carts
alias MzingaDelivery.Orders

IO.puts "\n=== STARTING UNIFIED CHECKOUT TEST ===\n"

# 0. Start Dependencies & Telemetry (Essential for Repo)
[:telemetry, :postgrex, :ecto_sql, :phoenix_pubsub, :finch, :httpoison]
|> Enum.each(&Application.ensure_all_started/1)

IO.puts "Starting Components Manually..."

# Start Telemetry (Ignored if running)
MzingaDeliveryWeb.Telemetry.start_link([])

# Start PubSub (Must be under a Supervisor)
try do
  Supervisor.start_link([{Phoenix.PubSub, name: MzingaDelivery.PubSub}], strategy: :one_for_one)
  IO.puts "PubSub started."
rescue
  e -> IO.puts "PubSub start info: #{inspect e}"
end

# FORCE SAFE REPO CONFIG
# Using credentials from .env (Supabase)
Application.put_env(:mzinga_delivery, MzingaDelivery.Repo, [
  username: "postgres.jkefjvrsuojtytezlxhk",
  password: "chapo_Seven7",
  hostname: "aws-1-eu-west-1.pooler.supabase.com",
  database: "postgres",
  port: 5432,
  pool_size: 4,
  timeout: 60_000,
  connect_timeout: 60_000,
  ssl: [verify: :verify_none], # Supabase usually needs SSL
  socket_options: [:inet, :keepalive]
])

# Start Repo
case MzingaDelivery.Repo.start_link() do
  {:ok, _} -> IO.puts "Repo started."
  {:error, {:already_started, _}} -> IO.puts "Repo already started."
  {:error, e} -> IO.puts "Repo failed: #{inspect e}"
end

# Start Finch
Finch.start_link(name: MzingaDelivery.Finch)
# IO.puts "Finch startup skipped for debug."

IO.puts "Testing Repo with simple query..."
try do
  case MzingaDelivery.Repo.query("SELECT 1") do
    {:ok, _} -> IO.puts "Repo is ALIVE and responding."
    {:error, e} -> IO.puts "Repo query failed: #{inspect e}"
  end
rescue
  e -> IO.puts "Repo crashed on query: #{inspect e}"
end

# 1. Setup User
user_email = "test_unified@example.com"
IO.puts "Fetching user..."
user = Accounts.get_user_by_email(user_email)

user =
  if user do
    {:ok, u} = Accounts.update_user(user, %{phone_number: "254702215776"})
    u
  else
    {:ok, u} = Accounts.create_user(%{
      email: user_email,
      password: "password123",
      phone_number: "254702215776",
      role: "customer",
      full_name: "Unified Tester"
    })
    u
  end

IO.puts "1. User Ready: #{user.email} (ID: #{user.id})"

# 2. Setup 3 Stores and Products
stores =
  Enum.map(1..3, fn i ->
    name = "Unified Store #{i}"
    store = Repo.get_by(Stores.Store, name: name)

    store =
      if store do
        store
      else
        {:ok, s} = Stores.create_store(%{
          name: name,
          description: "Test store #{i}",
          address: "123 Test St",
          image_url: "http://example.com/img.jpg",
          vendor_id: user.id
        })
        s
      end

    product_name = "Item from Store #{i}"
    # Product is under Stores namespace
    product = Repo.get_by(MzingaDelivery.Stores.Product, name: product_name, store_id: store.id)

    product =
      if product do
        product
      else
        {:ok, p} = Stores.create_product(%{
          name: product_name,
          price: "100.00",
          description: "Test Item",
          image_url: "http://example.com/item.jpg",
          category: "Food",
          stock: 50,
          store_id: store.id
        })
        p
      end
    product
  end)

IO.puts "2. Stores & Products Ready"

# 3. Setup Cart
Carts.clear_cart(user.id)
# cart = Carts.get_cart(user.id) # Not needed as add_item handles it

Enum.each(stores, fn product ->
  case Carts.add_item(user.id, product.id, 1) do
    {:ok, _} -> IO.puts "Added #{product.name} to cart"
    {:error, reason} -> IO.puts "Failed to add #{product.name}: #{inspect reason}"
  end
end)

cart = Carts.get_cart(user.id)
IO.puts "3. Cart Populated: #{length(cart.items)} items"

# 4. Initiate Unified Checkout
IO.puts "4. Initiating Checkout for 0702215776..."
params = %{"payment_phone" => "0702215776"}

case Orders.create_unified_checkout(user, params) do
  {:ok, result} ->
    IO.puts "\n=== CHECKOUT SUCCESS ==="
    IO.puts "Checkout Group ID: #{result.checkout_group_id}"
    req_id = result.mpesa_response["CheckoutRequestID"]
    IO.puts "CheckoutRequestID: #{req_id}"
    IO.puts "Orders Created: #{length(result.orders)}"

    IO.puts "\nTo simulate M-Pesa Callback (Copy this):"

    params = %{
      "Body" => %{
        "stkCallback" => %{
          "MerchantRequestID" => "12345",
          "CheckoutRequestID" => req_id,
          "ResultCode" => 0,
          "ResultDesc" => "Success",
          "CallbackMetadata" => %{
            "Item" => [
              %{"Name" => "Amount", "Value" => 300.00},
              %{"Name" => "MpesaReceiptNumber", "Value" => "TXT123456"},
              %{"Name" => "TransactionDate", "Value" => 20251225121212},
              %{"Name" => "PhoneNumber", "Value" => 254702215776}
            ]
          }
        }
      }
    }

    json = Jason.encode!(params)
    escaped_json = String.replace(json, "\"", "\\\"")

    # Use 4005 as instructed
    IO.puts "curl -X POST http://localhost:4005/api/payments/callback \\"
    IO.puts "  -H \"Content-Type: application/json\" \\"
    IO.puts "  -d '#{escaped_json}'"

  {:error, reason} ->
    IO.puts "\n=== CHECKOUT FAILED ==="
    IO.inspect(reason)
end
