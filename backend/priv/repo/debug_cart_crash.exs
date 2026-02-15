# Start dependencies
[:telemetry, :postgrex, :ecto_sql, :phoenix_pubsub, :finch, :httpoison]
|> Enum.each(&Application.ensure_all_started/1)

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

# Start PubSub (Must be under a Supervisor)
try do
  Supervisor.start_link([{Phoenix.PubSub, name: MzingaDelivery.PubSub}], strategy: :one_for_one)
  IO.puts "PubSub started."
rescue
  e -> IO.puts "PubSub start info: #{inspect e}"
end

alias MzingaDelivery.Carts
alias MzingaDelivery.Stores
alias MzingaDelivery.Repo

# 1. Setup User
user = MzingaDelivery.Accounts.get_user_by_email("test_unified@example.com") || exit("User not found")

# 2. Setup Product with potential edge case (e.g. nil price if allowed, or string price)
# Note: Schema enforces price presence, but let's check behavior if we force a bad state or pass weird params.

# Try adding a non-existent product
IO.puts "--- Testing Non-Existent Product ---"
result = Carts.add_item(user.id, 999999, 1)
IO.inspect(result, label: "Non-Existent Product Result")

# Try adding valid product
IO.puts "--- Testing Valid Product (ID 22) ---"
result = Carts.add_item(user.id, 22, 1)
IO.inspect(result, label: "Valid Product Result")

# Try adding product with quantity as STRING (if controller passes string)
# Controller params are map with strings, but Phoenix usually casts to schema types?
# WAIT, CartController add_item uses pattern matching: %{"product_id" => product_id, "quantity" => quantity}
# If JSON is {"quantity": 1}, it's integer. If {"quantity": "1"}, it's string.
# Let's test with String quantity.
IO.puts "--- Testing String Quantity ---"
try do
  result = Carts.add_item(user.id, 22, "1")
  IO.inspect(result, label: "String Quantity Result")
rescue
  e -> IO.puts "CRASHED on String Quantity: #{inspect e}"
end
