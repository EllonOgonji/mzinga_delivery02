defmodule MzingaDelivery.Delivery.RiderService do
  @moduledoc """
  Service for matching orders to riders and managing assignments.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Delivery.DeliveryRequest

  require Logger

  def get_request(id), do: Repo.get(DeliveryRequest, id)

  @doc """
  Dispatches an order to the nearest available rider who hasn't rejected it yet.
  """
  def dispatch_order(%Orders.Order{} = order) do
    store = Stores.get_store(order.store_id)

    # Get IDs of riders who already rejected this order
    rejected_rider_ids =
      from(dr in DeliveryRequest,
        where: dr.order_id == ^order.id and dr.status == "rejected",
        select: dr.rider_id
      )
      |> Repo.all()

    # Find nearest riders, excluding rejected ones
    available_riders =
      Accounts.list_nearby_available_riders(store.latitude, store.longitude)
      |> Enum.reject(fn rider -> rider.id in rejected_rider_ids end)

    case available_riders do
      [] ->
        Logger.info("No available riders found for order #{order.id} (All rejected or busy)")
        {:error, :no_riders_available}

      [rider | _others] ->
        Logger.info("Dispatching order #{order.id} to rider #{rider.id}")

        # Create Delivery Request
        %DeliveryRequest{}
        |> DeliveryRequest.changeset(%{
          order_id: order.id,
          rider_id: rider.id,
          status: "pending"
        })
        |> Repo.insert()
        |> case do
          {:ok, request} ->
            # Notify Rider
            MzingaDeliveryWeb.Endpoint.broadcast(
              "rider:#{rider.id}",
              "new_delivery_request",
              %{
                request_id: request.id,
                order_id: order.id,
                store_name: store.name,
                store_address: store.address,
                # In real app, name
                customer_name: order.customer_id
              }
            )

            {:ok, request}

          {:error, cs} ->
            {:error, cs}
        end
    end
  end

  def accept_request(request_id) do
    request = Repo.get(DeliveryRequest, request_id)

    if request && request.status == "pending" do
      Repo.transaction(fn ->
        # 1. Update Request
        request
        |> DeliveryRequest.changeset(%{status: "accepted"})
        |> Repo.update!()

        # 2. Assign Rider to Order
        {:ok, order} = Orders.get_order!(request.order_id)
        {:ok, updated_order} = Orders.assign_rider(order, request.rider_id)

        # 3. Mark Rider Busy
        rider = Accounts.get_user(request.rider_id)
        Accounts.update_rider_status(rider, %{is_available: false})

        updated_order
      end)
    else
      {:error, :invalid_request}
    end
  end

  def reject_request(request_id) do
    request = Repo.get(DeliveryRequest, request_id)

    if request && request.status == "pending" do
      result =
        Repo.transaction(fn ->
          # 1. Mark Rejected
          request
          |> DeliveryRequest.changeset(%{status: "rejected"})
          |> Repo.update!()

          # 2. Dispatch to NEXT rider
          {:ok, order} = Orders.get_order!(request.order_id)
          dispatch_order(order)
        end)

      case result do
        {:ok, _} -> {:ok, :rejected_and_dispatched}
        {:error, reason} -> {:error, reason}
      end
    else
      {:error, :invalid_request}
    end
  end

  @doc """
  Finds an available rider and assigns them to the order.
  NOW: Uses dispatch_order to create a pending request.
  """
  def assign_rider_to_order(order) do
    dispatch_order(order)
  end
end
