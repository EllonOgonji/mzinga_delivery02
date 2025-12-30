defmodule MzingaDelivery.ReviewVerifier do
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Rating
  require Logger

  def run do
    Logger.info("--- Starting Review Verification ---")

    # 1. Setup Data
    user_email = "reviewer_cust@test.com"
    rider_email = "rated_rider@test.com"

    customer = get_or_create_user(user_email, "customer")
    rider = get_or_create_user(rider_email, "rider")
    store_id = 60

    # 2. Case A: Order NOT delivered (Should Fail)
    {:ok, order_assigned} =
      Orders.create_order_with_items(%{
        "customer_id" => customer.id,
        "store_id" => store_id,
        "total_price" => Decimal.new("500.00"),
        "items" => [%{"product_id" => 5, "quantity" => 1, "subtotal" => 500}]
      })

    {:ok, order_assigned} = Orders.assign_rider(order_assigned, rider.id)

    Logger.info("Testing Review on Assigned Order (Status: #{order_assigned.delivery_status})")

    case Rating.create_review(%{
           "order_id" => order_assigned.id,
           "rating" => 5,
           "comment" => "Premature review"
         }) do
      {:error, :order_not_delivered} -> Logger.info("✅ Blocked premature review (Expected)")
      res -> Logger.error("❌ Failed to block premature review: #{inspect(res)}")
    end

    # 3. Case B: Order DELIVERED (Should Succeed)
    {:ok, order_delivered} =
      Orders.create_order_with_items(%{
        "customer_id" => customer.id,
        "store_id" => store_id,
        "total_price" => Decimal.new("500.00"),
        "items" => [%{"product_id" => 5, "quantity" => 1, "subtotal" => 500}]
      })

    {:ok, order_delivered} = Orders.assign_rider(order_delivered, rider.id)

    # Manually update to delivered (since we don't have a direct function exposed in context for 'delivered' state transition logic yet, or we use update_order)
    # Actually, let's use Orders.update_delivery_status? Wait, we haven't checked if that exists.
    # Let's just update via Repo for verification speed.
    order_delivered =
      Ecto.Changeset.change(order_delivered, delivery_status: "delivered") |> Repo.update!()

    Logger.info("Testing Review on Delivered Order (ID: #{order_delivered.id})")

    case Rating.create_review(%{
           "order_id" => order_delivered.id,
           "rating" => 5,
           "comment" => "Great job!"
         }) do
      {:ok, review} ->
        Logger.info("✅ Review Created Successfully (ID: #{review.id})")

        if review.customer_id == customer.id and review.rider_id == rider.id do
          Logger.info("   Linkage Correct (Customer/Rider match)")
        else
          Logger.error("   ❌ Linkage Mismatch")
        end

      {:error, e} ->
        Logger.error("❌ Failed to create review: #{inspect(e)}")
    end

    # 4. Case C: Duplicate Review (Should Fail)
    Logger.info("Testing Duplicate Review...")

    case Rating.create_review(%{
           "order_id" => order_delivered.id,
           "rating" => 1,
           "comment" => "Spam"
         }) do
      {:error, changeset} ->
        if "has already been taken" in (errors_on(changeset).order_id || []) do
          Logger.info("✅ Duplicate blocked (Unique Constraint)")
        else
          Logger.info("✅ Duplicate blocked (Changeset error: #{inspect(changeset.errors)})")
        end

      {:ok, _} ->
        Logger.error("❌ Duplicate Review ALLOWED (Should be unique per order)")
    end

    Logger.info("--- Verification Complete ---")
  end

  defp get_or_create_user(email, role) do
    case Accounts.get_user_by_email(email) do
      nil ->
        {:ok, u} =
          Accounts.create_user(%{
            full_name: "Test #{role}",
            email: email,
            phone_number:
              "2547#{System.unique_integer([:positive]) |> rem(100_000_000) |> Integer.to_string() |> String.pad_leading(8, "0")}",
            role: role,
            password: "password123",
            password_confirmation: "password123"
          })

        u

      user ->
        user
    end
  end

  defp errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end
