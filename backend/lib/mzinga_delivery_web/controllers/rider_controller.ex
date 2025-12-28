defmodule MzingaDeliveryWeb.RiderController do
  use MzingaDeliveryWeb, :controller
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  def update_availability(conn, params) do
    user = Guardian.Plug.current_resource(conn)

    # Ensure user is a rider
    if user.role == "rider" do
      case Accounts.update_rider_status(user, params) do
        {:ok, updated_user} ->
          conn
          |> put_view(MzingaDeliveryWeb.RiderView)
          |> render("rider.json", user: updated_user)

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> put_view(MzingaDeliveryWeb.RiderView)
          |> render("error.json", changeset: changeset)
      end
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Only riders can update availability"})
    end
  end

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    deliveries = Orders.list_rider_deliveries(user.id)

    conn
    |> put_view(MzingaDeliveryWeb.OrderView)
    |> render("index.json", orders: deliveries)
  end

  def update_status(conn, %{"id" => id, "status" => status}) do
    user = Guardian.Plug.current_resource(conn)

    # Get order strictly checking if it exists first
    case Orders.get_order(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Order not found"})

      order ->
        # Verify order belongs to rider
        if order.rider_id == user.id do
          case Orders.update_delivery_status(order, status) do
            {:ok, updated_order} ->
              conn
              |> put_view(MzingaDeliveryWeb.OrderView)
              |> render("show.json", order: updated_order)

            {:error, changeset} ->
              conn
              |> put_status(:unprocessable_entity)
              # Use OrderView for error rendering if consistent, or RiderView
              |> put_view(MzingaDeliveryWeb.OrderView)
              |> render("error.json", changeset: changeset)
          end
        else
          conn
          |> put_status(:forbidden)
          |> json(%{error: "Not authorized to update this delivery"})
        end
    end
  end
end
