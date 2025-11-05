defmodule MzingaDeliveryWeb.OrderController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Orders
  alias MzingaDelivery.Payments
  alias MzingaDelivery.Payments.MpesaService
  alias MzingaDelivery.Auth.Guardian
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Notifications

  require Logger

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  List orders (filtered by role)
  GET /api/orders
  """
  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    orders =
      case user.role do
        "customer" ->
          Orders.list_customer_orders(user.id)

        "vendor" ->
          # Get all stores owned by vendor
          stores = Stores.get_stores_by_vendor(user.id)
          store_ids = Enum.map(stores, & &1.id)

          # Get orders for all vendor's stores
          Enum.flat_map(store_ids, &Orders.list_store_orders/1)

        "admin" ->
          Orders.list_orders()

        _ ->
          []
      end

    render(conn, "index.json", orders: orders)
  end

  @doc """
  Get single order
  GET /api/orders/:id
  """
  def show(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)

    with {:ok, order} <- Orders.get_order!(id),
         true <- can_view_order?(user, order) do
      render(conn, "show.json", order: order)
    else
      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Order not found"})

      false ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Not authorized to view this order"})
    end
  end

  @doc """
  Create order and initiate payment
  POST /api/orders

  Body:
  {
    "order": {
      "store_id": 1,
      "items": [
        {"product_id": 1, "quantity": 2, "subtotal": 500.00}
      ]
    }
  }
  """
  def create(conn, %{"order" => order_params}) do
    user = Guardian.Plug.current_resource(conn)

    Logger.info("Creating order for user #{user.id}")

    # Add customer_id to order params
    order_params = Map.put(order_params, "customer_id", user.id)

    # Calculate total from items
    items = Map.get(order_params, "items", [])

    total_price =
      Enum.reduce(items, Decimal.new(0), fn item, acc ->
        subtotal = item["subtotal"] || 0
        Decimal.add(acc, Decimal.new(to_string(subtotal)))
      end)

    order_params = Map.put(order_params, "total_price", total_price)

    case Orders.create_order_with_items(order_params) do
      {:ok, order} ->
        Logger.info("Order #{order.id} created successfully")

        # Create payment record
        {:ok, payment} =
          Payments.create_payment(%{
            order_id: order.id,
            amount: order.total_price,
            status: "pending"
          })

        # Initiate M-Pesa STK Push
        case MpesaService.initiate_stk_push(user.phone, order.total_price, order.id) do
          {:ok, mpesa_response} ->
            Logger.info("M-Pesa STK Push initiated for order #{order.id}")

            # Update payment with checkout_request_id
            checkout_request_id = mpesa_response["CheckoutRequestID"]
            Payments.update_payment(payment, %{transaction_id: checkout_request_id})

            # Get store with vendor info
            store = Stores.get_store(order.store_id)

            # Broadcast to store owner via WebSocket
            MzingaDeliveryWeb.Endpoint.broadcast(
              "notifications:store_#{order.store_id}",
              "new_order",
              %{
                order_id: order.id,
                customer_name: user.full_name,
                customer_phone: user.phone,
                total: Decimal.to_float(order.total_price),
                items_count: length(order.order_items),
                timestamp: DateTime.utc_now()
              }
            )

            # Save notification to database for vendor
            Notifications.create_notification(%{
              user_id: store.vendor_id,
              message: "New order ##{order.id} from #{user.full_name} - KES #{Decimal.to_float(order.total_price)}",
              type: "new_order"
            })

            Logger.info("Notification sent to vendor #{store.vendor_id} for order #{order.id}")

            conn
            |> put_status(:created)
            |> render("show.json", order: order, mpesa_response: mpesa_response)

          {:error, reason} ->
            Logger.error("M-Pesa STK Push failed for order #{order.id}: #{inspect(reason)}")

            # Payment initiation failed, but order is created
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{
              error: "Payment initiation failed",
              reason: reason,
              order_id: order.id,
              message: "Order created but payment failed. Please retry payment."
            })
        end

      {:error, changeset} ->
        Logger.error("Order creation failed: #{inspect(changeset.errors)}")

        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  @doc """
  Accept order (vendor only)
  PATCH /api/orders/:id/accept
  """
  def accept(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)

    Logger.info("User #{user.id} attempting to accept order #{id}")

    with {:ok, order} <- Orders.get_order!(id),
         true <- can_manage_order?(user, order),
         {:ok, updated_order} <- Orders.accept_order(order) do
      Logger.info("Order #{id} accepted by user #{user.id}")

      # Broadcast to customer via WebSocket
      MzingaDeliveryWeb.Endpoint.broadcast(
        "notifications:customer_#{order.customer_id}",
        "order_accepted",
        %{
          order_id: order.id,
          store_name: order.store.name,
          message: "Your order has been accepted and is being prepared",
          timestamp: DateTime.utc_now()
        }
      )

      # Save notification to database for customer
      Notifications.create_notification(%{
        user_id: order.customer_id,
        message: "Your order ##{order.id} from #{order.store.name} has been accepted!",
        type: "order_accepted"
      })

      Logger.info("Notification sent to customer #{order.customer_id} for order #{id}")

      render(conn, "show.json", order: updated_order)
    else
      {:error, :not_found} ->
        Logger.warning("Order #{id} not found")

        conn
        |> put_status(:not_found)
        |> json(%{error: "Order not found"})

      false ->
        Logger.warning("User #{user.id} unauthorized to accept order #{id}")

        conn
        |> put_status(:forbidden)
        |> json(%{error: "Not authorized to manage this order"})

      {:error, :invalid_status_transition} ->
        Logger.warning("Invalid status transition for order #{id}")

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Cannot accept order in current status"})
    end
  end

  @doc """
  Reject order (vendor only)
  PATCH /api/orders/:id/reject
  """
  def reject(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)

    Logger.info("User #{user.id} attempting to reject order #{id}")

    with {:ok, order} <- Orders.get_order!(id),
         true <- can_manage_order?(user, order),
         {:ok, updated_order} <- Orders.reject_order(order) do
      Logger.info("Order #{id} rejected by user #{user.id}")

      # Broadcast to customer via WebSocket
      MzingaDeliveryWeb.Endpoint.broadcast(
        "notifications:customer_#{order.customer_id}",
        "order_rejected",
        %{
          order_id: order.id,
          store_name: order.store.name,
          message: "Your order has been rejected by the store",
          timestamp: DateTime.utc_now()
        }
      )

      # Save notification to database for customer
      Notifications.create_notification(%{
        user_id: order.customer_id,
        message: "Your order ##{order.id} from #{order.store.name} has been rejected. Please contact the store for details.",
        type: "order_rejected"
      })

      Logger.info("Notification sent to customer #{order.customer_id} for rejected order #{id}")

      render(conn, "show.json", order: updated_order)
    else
      {:error, :not_found} ->
        Logger.warning("Order #{id} not found")

        conn
        |> put_status(:not_found)
        |> json(%{error: "Order not found"})

      false ->
        Logger.warning("User #{user.id} unauthorized to reject order #{id}")

        conn
        |> put_status(:forbidden)
        |> json(%{error: "Not authorized to manage this order"})

      {:error, :invalid_status_transition} ->
        Logger.warning("Invalid status transition for order #{id}")

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Cannot reject order in current status"})
    end
  end


  # Check if user can view the order
  defp can_view_order?(user, order) do
    user.role == "admin" ||
      user.id == order.customer_id ||
      (user.role == "vendor" && order_belongs_to_vendor?(user.id, order.store_id))
  end

  # Check if user can manage (accept/reject) the order
  defp can_manage_order?(user, order) do
    user.role == "admin" ||
      (user.role == "vendor" && order_belongs_to_vendor?(user.id, order.store_id))
  end

  # Check if store belongs to vendor
  defp order_belongs_to_vendor?(vendor_id, store_id) do
    case Stores.get_store(store_id) do
      nil -> false
      store -> store.vendor_id == vendor_id
    end
  end
end
