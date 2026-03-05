defmodule MzingaDelivery.Orders do
  @moduledoc """
  The Orders context - manages orders and order items.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Orders.{Order, OrderItem}
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Carts
  alias MzingaDelivery.Payments
  alias MzingaDelivery.Payments.MpesaService
  alias MzingaDeliveryWeb.Endpoint

  @doc """
  Returns the list of orders.
  """
  def list_orders do
    Order
    |> preload([:customer, store: :vendor, order_items: :product])
    |> Repo.all()
  end

  @doc """
  Calculates the total value of all successful (delivered) orders.
  Accepts an optional timeframe: :all, :day, :week, :month, :year
  """
  def get_total_successful_order_value(timeframe \\ :all) do
    # Filter by delivered items
    # In MzingaDelivery, an order status is derived from its items
    # This means an order doesn't have a direct "status" column!
    # A successful order has all items delivered.

    query =
      Order
      |> join(:inner, [o], item in assoc(o, :order_items))
      |> where([o, item], item.status == "delivered")

    query =
      case timeframe do
        :day ->
          time_limit = DateTime.utc_now() |> DateTime.add(-24, :hour)
          where(query, [o, _item], o.inserted_at >= ^time_limit)

        :week ->
          time_limit = DateTime.utc_now() |> DateTime.add(-7, :day)
          where(query, [o, _item], o.inserted_at >= ^time_limit)

        :month ->
          time_limit = DateTime.utc_now() |> DateTime.add(-30, :day)
          where(query, [o, _item], o.inserted_at >= ^time_limit)

        :year ->
          time_limit = DateTime.utc_now() |> DateTime.add(-365, :day)
          where(query, [o, _item], o.inserted_at >= ^time_limit)

        :all ->
          query
      end

    # The order has a total_price column, but since we are joining order_items,
    # we should grab a distinct order amount to avoid multiplying the joined items
    # or just use fragment to sum distinct
    Repo.one(
      from([o, _item] in query,
        select: type(fragment("COALESCE(SUM(DISTINCT ?), 0)", o.total_price), :decimal)
      )
    )
  end

  @doc """
  Returns orders for a specific customer.
  """
  def list_customer_orders(customer_id) do
    Order
    |> where([o], o.customer_id == ^customer_id)
    |> preload([:customer, store: :vendor, order_items: :product])
    |> order_by([o], desc: o.inserted_at)
    |> Repo.all()
  end

  @doc """
  Returns orders for a specific store.
  """
  def list_store_orders(store_id) do
    Order
    |> where([o], o.store_id == ^store_id)
    |> preload([:customer, store: :vendor, order_items: :product])
    |> order_by([o], desc: o.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets a single order.
  """
  def get_order(id) do
    Order
    |> preload([:customer, store: :vendor, order_items: :product])
    |> Repo.get(id)
  end

  @doc """
  Gets a single order with error tuple.
  """
  def get_order!(id) do
    case get_order(id) do
      nil -> {:error, :not_found}
      order -> {:ok, order}
    end
  end

  @doc """
  Creates an order with items in a transaction.
  """
  def create_order_with_items(attrs) do
    Repo.transaction(fn ->
      # Extract items from attrs
      items = Map.get(attrs, "items", [])
      order_attrs = Map.drop(attrs, ["items"])

      # Create order
      with {:ok, order} <- create_order(order_attrs),
           {:ok, _items} <- create_order_items(order.id, items) do
        # Reduce product stock
        Enum.each(items, fn item ->
          Stores.reduce_product_stock(item["product_id"], item["quantity"])
        end)

        # Reload order with items
        get_order(order.id)
      else
        {:error, reason} -> Repo.rollback(reason)
      end
    end)
  end

  @doc """
  Creates a single order.
  """
  def create_order(attrs \\ %{}) do
    %Order{}
    |> Order.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Creates multiple order items.
  """
  def create_order_items(order_id, items) when is_list(items) do
    items_with_order_id =
      Enum.map(items, fn item ->
        Map.put(item, "order_id", order_id)
      end)

    changesets =
      Enum.map(items_with_order_id, fn item_attrs ->
        %OrderItem{}
        |> OrderItem.changeset(item_attrs)
      end)

    # Check if all changesets are valid
    if Enum.all?(changesets, & &1.valid?) do
      results = Enum.map(changesets, &Repo.insert/1)
      {:ok, results}
    else
      invalid = Enum.find(changesets, &(not &1.valid?))
      {:error, invalid}
    end
  end

  @doc """
  Updates an order.
  """
  def update_order(%Order{} = order, attrs) do
    order
    |> Order.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates order status.
  """
  def update_order_status(%Order{} = order, status) do
    order
    |> Order.update_status_changeset(%{order_status: status})
    |> Repo.update()
  end

  @doc """
  Updates payment status.
  """
  def update_payment_status(%Order{} = order, status) do
    order
    |> Order.update_status_changeset(%{payment_status: status})
    |> Repo.update()
  end

  @doc """
  Accept order (vendor action).
  """
  def accept_order(%Order{} = order) do
    Repo.transaction(fn ->
      # Update all order items to confirmed
      order_items = Repo.preload(order, :order_items).order_items

      Enum.each(order_items, fn item ->
        item
        |> OrderItem.changeset(%{status: "confirmed"})
        |> Repo.update()
      end)

      Repo.preload(order, [:order_items, :customer, :store], force: true)
    end)
  end

  @doc """
  Reject order (vendor action).
  """
  def reject_order(%Order{} = order) do
    Repo.transaction(fn ->
      # Update all order items to cancelled
      order_items = Repo.preload(order, :order_items).order_items

      Enum.each(order_items, fn item ->
        item
        |> OrderItem.changeset(%{status: "cancelled"})
        |> Repo.update()
      end)

      Repo.preload(order, [:order_items, :customer, :store], force: true)
    end)
  end

  @doc """
  Get order status based on order items
  Returns: Pending, confirmed, preparing, ready, delicered, cancelled
  """
  def get_orders_status(%Order{} = order) do
    order = Repo.preload(order, :order_items)
    statuses = Enum.map(order.order_items, & &1.status)

    cond do
      Enum.empty?(statuses) -> "pending"
      Enum.all?(statuses, &(&1 == "cancelled")) -> "cancelled"
      Enum.all?(statuses, &(&1 == "delivered")) -> "delivered"
      Enum.all?(statuses, &(&1 == "ready")) -> "ready"
      Enum.any?(statuses, &(&1 == "preparing")) -> "preparing"
      Enum.any?(statuses, &(&1 == "confirmed")) -> "confirmed"
      Enum.any?(statuses, &(&1 == "pending")) -> "pending"
      true -> "processing"
    end
  end

  @doc """
  Deletes an order.
  """
  def delete_order(%Order{} = order) do
    Repo.delete(order)
  end

  @doc """
  Updates the status of an order item.
  """
  def update_order_item_status(order_id, item_id, status) do
    item = Repo.get!(OrderItem, item_id)

    if item.order_id != String.to_integer(to_string(order_id)) do
      {:error, :invalid_order_item}
    else
      Repo.transaction(fn ->
        # Get old status before update
        {:ok, old_order} = get_order!(order_id)
        old_status = get_orders_status(old_order)

        case item
             |> OrderItem.changeset(%{status: status})
             |> Repo.update() do
          {:ok, _item} ->
            # Return updated order with all items to reflect new status
            {:ok, updated_order} = get_order!(order_id)
            new_status = get_orders_status(updated_order)

            # Broadcast if status changed to "ready"
            if old_status != "ready" && new_status == "ready" do
              Endpoint.broadcast("riders:lobby", "order_ready", %{
                order_id: updated_order.id,
                store: updated_order.store.name,
                address: updated_order.store.address,
                # Placeholder
                pickup_location: %{lat: -1.2921, lng: 36.8219}
              })
            end

            updated_order

          {:error, changeset} ->
            Repo.rollback(changeset)
        end
      end)
    end
  end

  @doc """
  Assigns a rider to an order.
  """
  def assign_rider(order_id, rider_id) do
    Repo.transaction(fn ->
      order = Repo.get!(Order, order_id)

      if order.rider_id do
        Repo.rollback(:order_taken)
      else
        order
        |> Order.changeset(%{rider_id: rider_id})
        |> Repo.update()
        |> case do
          {:ok, updated_order} -> updated_order
          {:error, changeset} -> Repo.rollback(changeset)
        end
      end
    end)
  end

  @doc """
  Creates unified checkout orders for cart items.
  Splits items by store, creates one order per store, and one payment for the total.
  """
  def create_unified_checkout(user, attrs \\ %{}) do
    payment_phone = Map.get(attrs, "payment_phone") || user.phone_number

    # Get Cart
    cart = Carts.get_cart(user.id)

    if is_nil(cart) or Enum.empty?(cart.items) do
      {:error, :empty_cart}
    else
      Repo.transaction(
        fn ->
          items = cart.items
          checkout_group_id = Ecto.UUID.generate()

          # Group items by store
          grouped_items = Enum.group_by(items, & &1.product.store_id)

          # Create Orders (one per store)
          created_orders =
            Enum.map(grouped_items, fn {store_id, store_items} ->
              total_price =
                Enum.reduce(store_items, Decimal.new(0), &Decimal.add(&1.subtotal, &2))

              # Prepare Order Items attrs
              order_items_attrs =
                Enum.map(store_items, fn item ->
                  %{
                    "product_id" => item.product_id,
                    "quantity" => item.quantity,
                    "subtotal" => item.subtotal
                  }
                end)

              order_params = %{
                "customer_id" => user.id,
                "store_id" => store_id,
                "total_price" => total_price,
                "checkout_group_id" => checkout_group_id,
                "payment_status" => "pending",
                "delivery_lat" => Map.get(attrs, "delivery_lat"),
                "delivery_lng" => Map.get(attrs, "delivery_lng"),
                "items" => order_items_attrs
              }

              case create_order_with_items(order_params) do
                {:ok, order} -> order
                {:error, reason} -> Repo.rollback(reason)
              end
            end)

          # Calculate Grand Total
          grand_total =
            Enum.reduce(created_orders, Decimal.new(0), &Decimal.add(&1.total_price, &2))

          # Create Payment
          {:ok, payment} =
            Payments.create_payment(%{
              checkout_group_id: checkout_group_id,
              amount: grand_total,
              status: "pending",
              provider: "M-Pesa"
            })

          # Initiate M-Pesa STK Push
          # Use short ref for AccountReference
          ref_id = "GRP-#{String.slice(checkout_group_id, 0, 8)}"

          case MpesaService.initiate_stk_push(payment_phone, grand_total, ref_id) do
            {:ok, mpesa_response} ->
              # Update payment with transaction ID
              Payments.update_payment(payment, %{
                transaction_id: mpesa_response["CheckoutRequestID"]
              })

              # Clear Cart
              Carts.clear_cart(user.id)

              %{
                status: "payment_initiated",
                checkout_group_id: checkout_group_id,
                payment: payment,
                orders: created_orders,
                mpesa_response: mpesa_response,
                message: "Payment initiated for #{length(created_orders)} orders"
              }

            {:error, reason} ->
              Repo.rollback(reason)
          end
        end,
        timeout: 60_000
      )
    end
  end

  @doc """
  Updates payment status for all orders in a checkout group.
  """
  def update_group_orders_payment_status(group_id, status) do
    from(o in Order, where: o.checkout_group_id == ^group_id)
    |> Repo.update_all(set: [payment_status: status])
  end

  @doc """
  Get all orders in a checkout group.
  """
  def get_orders_by_group(group_id) do
    from(o in Order, where: o.checkout_group_id == ^group_id)
    |> Repo.all()
    |> Repo.preload(:customer)
  end
end
