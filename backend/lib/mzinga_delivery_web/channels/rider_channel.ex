defmodule MzingaDeliveryWeb.RiderChannel do
  use MzingaDeliveryWeb, :channel

  require Logger

  @doc """
  Authorize rider to join their own channel.
  Topic: "rider:{id}"
  """
  def join("rider:" <> rider_id, _payload, socket) do
    user = socket.assigns.current_user

    if to_string(user.id) == rider_id and user.role == "rider" do
      Logger.info("Rider #{rider_id} joined channel")
      {:ok, socket}
    else
      Logger.warning("Unauthorized access to rider channel #{rider_id} by user #{user.id}")
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Handle "new_delivery" events if needed, but broadcast pushes automatically to client.
  # Client should listen for "new_delivery" event.
end
