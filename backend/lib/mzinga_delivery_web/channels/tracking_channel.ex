defmodule MzingaDeliveryWeb.TrackingChannel do
  use MzingaDeliveryWeb, :channel
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Accounts
  require Logger

  @doc """
  Authorize access to tracking channel.
  Topic: "tracking:{order_id}"
  """
  def join("tracking:" <> order_id_str, _payload, socket) do
    user = socket.assigns.current_user
    order_id = String.to_integer(order_id_str)

    case Orders.get_order(order_id) do
      nil ->
        {:error, %{reason: "order_not_found"}}

      order ->
        if authorized?(user, order) do
          Logger.info("User #{user.id} (#{user.role}) joined tracking for order #{order.id}")
          {:ok, socket}
        else
          Logger.warning("Unauthorized tracking attempt for order #{order.id} by user #{user.id}")
          {:error, %{reason: "unauthorized"}}
        end
    end
  end

  @doc """
  Handle incoming location updates from Rider.
  Payload: %{"lat" => float, "lng" => float}
  """
  def handle_in("update_location", %{"lat" => lat, "lng" => lng}, socket) do
    user = socket.assigns.current_user

    if user.role == "rider" do
      # 1. Update Rider's last known location in DB (async)
      Task.start(fn ->
        Accounts.update_rider_location(user, lat, lng)
      end)

      # 2. Broadcast to all subscribers (Customer hears this)
      MzingaDeliveryWeb.Endpoint.broadcast!(socket.topic, "location_update", %{
        lat: lat,
        lng: lng,
        rider_id: user.id
      })

      {:noreply, socket}
    else
      # Customers/Admins shouldn't push locations
      {:noreply, socket}
    end
  end

  defp authorized?(user, _order) when user.role == "admin", do: true

  defp authorized?(user, order) when user.role == "customer" and order.customer_id == user.id,
    do: true

  defp authorized?(user, order) when user.role == "rider" and order.rider_id == user.id, do: true
  defp authorized?(_, _), do: false
end
