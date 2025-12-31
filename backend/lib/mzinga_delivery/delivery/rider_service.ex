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

    # Find best rider (sort by distance to store)
    # Using Accounts.list_nearby_available_riders if implemented, or fetching all and sorting in memory.
    # For performance at scale, use SQL. For MVP, memory sort is fine (assuming <1000 active riders).
    # Since we don't have list_nearby_available_riders in Accounts yet, let's add it or do in-memory here.
    # Let's add list_nearby_riders to Accounts for consistency.

    # Actually, to keep it clean, let's call Accounts.list_nearby_available_riders(store.latitude, store.longitude)
    # We need to implement that in Accounts first.
    case Accounts.list_nearby_available_riders(store.latitude, store.longitude) do
      [] ->
        Logger.info("No available riders found near store #{store.id}")
        {:error, :no_riders_available}

      [rider | _others] ->
        Logger.info("Assigning nearest rider #{rider.id} to order #{order.id}")

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
            # In real app, name
            customer_name: order.customer_id
          }
        )

        {:ok, updated_order}
    end
  end
end
