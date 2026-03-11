defmodule MzingaDeliveryWeb.Rider.OrderController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Orders
  alias MzingaDelivery.Auth.Guardian
  alias MzingaDelivery.Notifications

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  List available orders for pickup (rider only)
  GET /api/rider/orders/available
  """
  def available_for_pickup(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    if user.role != "rider" do
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Only riders can view available orders"})
    else
      orders = Orders.list_available_for_pickup()

      conn
      |> put_view(MzingaDeliveryWeb.OrderView)
      |> render("index.json", orders: orders)
    end
  end

  @doc """
  List orders assigned to the rider
  GET /api/rider/orders/assigned
  """
  def assigned_to_rider(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    if user.role != "rider" do
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Only riders can view assigned orders"})
    else
      orders = Orders.list_rider_assigned_orders(user.id)

      conn
      |> put_view(MzingaDeliveryWeb.OrderView)
      |> render("index.json", orders: orders)
    end
  end

  @doc """
  Pick order (rider only)
  POST /api/rider/orders/:id/pick
  """
  def pick_order(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)

    if user.role != "rider" do
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Only riders can pick orders"})
    else
      case Orders.assign_rider(id, user.id) do
        {:ok, updated_order} ->
          conn
          |> put_view(MzingaDeliveryWeb.OrderView)
          |> render("show.json", order: updated_order)

        {:error, :not_found} ->
          conn
          |> put_status(:not_found)
          |> json(%{error: "Order not found"})

        {:error, :order_taken} ->
          conn
          |> put_status(:conflict)
          |> json(%{error: "Order already taken by another rider"})

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> put_view(MzingaDeliveryWeb.ErrorView)
          |> render("error.json", changeset: changeset)
      end
    end
  end

  @doc """
  Deliver order (rider only)
  PATCH /api/rider/orders/:id/deliver
  """
  def deliver(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)

    if user.role != "rider" do
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Only riders can perform this action"})
    else
      with {:ok, order} <- Orders.get_order!(id),
           {:ok, updated_order} <- Orders.deliver_order(order, user.id) do
        # Broadcast to customer
        MzingaDeliveryWeb.Endpoint.broadcast(
          "notifications:customer_#{order.customer_id}",
          "order_delivered",
          %{
            order_id: order.id,
            store_name: order.store.name,
            message: "Your order has been delivered! Enjoy!",
            timestamp: DateTime.utc_now()
          }
        )

        Notifications.create_notification(%{
          user_id: order.customer_id,
          message: "Your order ##{order.id} from #{order.store.name} has been delivered. Enjoy!",
          type: "order_delivered"
        })

        conn
        |> put_view(MzingaDeliveryWeb.OrderView)
        |> render("show.json", order: updated_order)
      else
        {:error, :not_found} ->
          conn
          |> put_status(:not_found)
          |> json(%{error: "Order not found"})

        {:error, :unauthorized} ->
          conn
          |> put_status(:forbidden)
          |> json(%{error: "You are not assigned to this order"})

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> put_view(MzingaDeliveryWeb.ErrorView)
          |> render("error.json", changeset: changeset)
      end
    end
  end
end
