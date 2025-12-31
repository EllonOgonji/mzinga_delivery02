defmodule MzingaDeliveryWeb.RiderController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Delivery.RiderService
  alias MzingaDeliveryWeb.FallbackController
  alias MzingaDelivery.Accounts

  action_fallback FallbackController

  # Existing endpoints (simplified/placeholder if any)
  def index(conn, _params) do
    # TODO: specific implementation
    deliveries = []
    render(conn, :index, deliveries: deliveries)
  end

  def update_status(conn, %{"id" => _id, "status" => _status}) do
    # Placeholder for delivery status update (picked_up, delivered)
    # This might need to be moved/implemented properly later
    conn |> json(%{status: "ok"})
  end

  def update_availability(conn, %{"is_available" => is_available}) do
    rider = conn.assigns.current_user
    {:ok, rider} = Accounts.update_rider_status(rider, %{is_available: is_available})
    render(conn, :show, user: rider)
  end

  # NEW: Request Flow

  def accept_request(conn, %{"id" => request_id}) do
    case RiderService.accept_request(request_id) do
      {:ok, order} ->
        conn
        |> put_status(:ok)
        |> json(%{status: "accepted", order_id: order.id})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: inspect(reason)})
    end
  end

  def reject_request(conn, %{"id" => request_id}) do
    case RiderService.reject_request(request_id) do
      {:ok, :rejected_and_dispatched} ->
        conn
        |> put_status(:ok)
        |> json(%{status: "rejected"})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: inspect(reason)})
    end
  end
end
