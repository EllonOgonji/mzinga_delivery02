defmodule MzingaDeliveryWeb.NotificationChannel do
  use MzingaDeliveryWeb, :channel

  require Logger

  @doc """
  Join notification channels with authentication.
  Channels:
  - notifications:store_<store_id> (vendors)
  - notifications:customer_<customer_id> (customers)
  """
  def join("notifications:store_" <> store_id, _payload, socket) do
    user = socket.assigns.current_user

    Logger.info("User #{user.id} attempting to join store channel: #{store_id}")

    case MzingaDelivery.Stores.get_store(store_id) do
      nil ->
        Logger.warning("Store #{store_id} not found")
        {:error, %{reason: "Store not found"}}

      store ->
        # Vendor must own the store OR be admin
        if store.vendor_id == user.id || user.role == "admin" do
          Logger.info("User #{user.id} joined store channel #{store_id}")
          {:ok, socket}
        else
          Logger.warning("User #{user.id} unauthorized for store #{store_id}")
          {:error, %{reason: "unauthorized"}}
        end
    end
  end

  def join("notifications:customer_" <> customer_id, _payload, socket) do
    user = socket.assigns.current_user

    Logger.info("User #{user.id} attempting to join customer channel: #{customer_id}")

    # Customer can only join their own channel OR admin
    if to_string(user.id) == customer_id || user.role == "admin" do
      Logger.info("User #{user.id} joined customer channel #{customer_id}")
      {:ok, socket}
    else
      Logger.warning("User #{user.id} unauthorized for customer channel #{customer_id}")
      {:error, %{reason: "unauthorized"}}
    end
  end

  def join("notifications:" <> _channel, _payload, socket) do
    user = socket.assigns.current_user
    Logger.warning("User #{user.id} attempted to join invalid channel")
    {:error, %{reason: "invalid_channel"}}
  end

  @doc """
  Handle incoming messages (optional - for client-to-server messages)
  """
  def handle_in("ping", _payload, socket) do
    {:reply, {:ok, %{message: "pong"}}, socket}
  end

  def handle_in(_event, _payload, socket) do
    {:noreply, socket}
  end
end
