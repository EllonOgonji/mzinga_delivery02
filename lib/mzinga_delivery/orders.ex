defmodule MzingaDelivery.Orders do
  @moduledoc """
  The Orders context - manages orders and order items.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Orders.{Order, OrderItem}
  alias MzingaDelivery.Stores

  @doc """
  Returns the list of orders.
  """
  def list_orders do
    Order
    |> preload([:customer, :store, :order_items])
    |> Repo.all()
  end

  @doc """
  Returns orders for a specific customer.
  """
  def list_customer_orders(customer_id) do
    Order
    |> where([o], o.customer_id == ^customer_id)
    |> preload([:store, :order_items])
    |> order_by([o], desc: o.inserted_at)
    |> Repo.all()
  end

  @doc """
  Returns orders for a specific store.
  """
  def list_store_orders(store_id) do
    Order
    |> where([o], o.store_id == ^store_id)
    |> preload([:customer, :order_items])
    |> order_by([o], desc: o.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets a single order.
  """
  def get_order(id) do
    Order
    |> preload([:customer, :store, order_items: :product])
    |> Repo.get(id)
  end

  @doc """
  Gets a single order with error tuple.
  """
  def get_order!(id) do
    case get_order(id) do
      nil -> {:error, :not_found}
      order -> {:ok, order}
    end
  end

  @doc """
  Creates an order with items in a transaction.
  """
  def create_order_with_items(attrs) do
    Repo.transaction(fn ->
      # Extract items from attrs
      items = Map.get(attrs, "items", [])
      order_attrs = Map.drop(attrs, ["items"])

      # Create order
      with {:ok, order} <- create_order(order_attrs),
           {:ok, _items} <- create_order_items(order.id, items) do
        # Reduce product stock
        Enum.each(items, fn item ->
          Stores.reduce_product_stock(item["product_id"], item["quantity"])
        end)

        # Reload order with items
        get_order(order.id)
      else
        {:error, reason} -> Repo.rollback(reason)
      end
    end)
  end

  @doc """
  Creates a single order.
  """
  def create_order(attrs \\ %{}) do
    %Order{}
    |> Order.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Creates multiple order items.
  """
  def create_order_items(order_id, items) when is_list(items) do
    items_with_order_id = Enum.map(items, fn item ->
      Map.put(item, "order_id", order_id)
    end)

    changesets = Enum.map(items_with_order_id, fn item_attrs ->
      %OrderItem{}
      |> OrderItem.changeset(item_attrs)
    end)

    # Check if all changesets are valid
    if Enum.all?(changesets, & &1.valid?) do
      results = Enum.map(changesets, &Repo.insert/1)
      {:ok, results}
    else
      invalid = Enum.find(changesets, &(not &1.valid?))
      {:error, invalid}
    end
  end

  @doc """
  Updates an order.
  """
  def update_order(%Order{} = order, attrs) do
    order
    |> Order.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates order status.
  """
  def update_order_status(%Order{} = order, status) do
    order
    |> Order.update_status_changeset(%{order_status: status})
    |> Repo.update()
  end

  @doc """
  Updates payment status.
  """
  def update_payment_status(%Order{} = order, status) do
    order
    |> Order.update_status_changeset(%{payment_status: status})
    |> Repo.update()
  end

  @doc """
  Accept order (vendor action).
  """
  def accept_order(%Order{} = order) do
    if order.order_status == "pending" do
      update_order_status(order, "accepted")
    else
      {:error, :invalid_status_transition}
    end
  end

  @doc """
  Reject order (vendor action).
  """
  def reject_order(%Order{} = order) do
    if order.order_status == "pending" do
      update_order_status(order, "rejected")
    else
      {:error, :invalid_status_transition}
    end
  end

  @doc """
  Deletes an order.
  """
  def delete_order(%Order{} = order) do
    Repo.delete(order)
  end
end
