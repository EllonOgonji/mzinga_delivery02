defmodule MzingaDelivery.Delivery.RiderService do
  @moduledoc """
  Service for matching orders to riders and managing assignments.
  """

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Stores

  require Logger

  @doc """
  Finds an available rider and assigns them to the order.
  """
  def assign_rider_to_order(%Orders.Order{} = order) do
    # Get store location
    store = Stores.get_store(order.store_id)

    # Find best rider (for now, first available)
    # In future: calculating geospatial distance using store.latitude/longitude vs rider.last_lat/lng
    case Accounts.list_available_riders() do
      [] ->
        Logger.info("No available riders for order #{order.id}")
        {:error, :no_riders_available}

      [rider | _others] ->
        Logger.info("Assigning rider #{rider.id} to order #{order.id}")

        # 1. Assign rider to order
        {:ok, updated_order} = Orders.assign_rider(order, rider.id)

        # 2. Mark rider as busy (unavailable)
        {:ok, _updated_rider} = Accounts.update_rider_status(rider, %{is_available: false})

        # 3. Notify Rider via WebSocket (Topic: "rider:{id}")
        MzingaDeliveryWeb.Endpoint.broadcast(
          "rider:#{rider.id}",
          "new_delivery",
          %{
            order_id: order.id,
            store_name: store.name,
            store_address: store.address,
            # In real app, preload customer
            customer_name: order.customer_id
          }
        )

        {:ok, updated_order}
    end
  end
end
