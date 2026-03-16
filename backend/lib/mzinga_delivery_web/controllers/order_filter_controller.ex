defmodule MzingaDeliveryWeb.OrderFilterController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Orders
  alias MzingaDelivery.Auth.Guardian
  alias MzingaDelivery.Stores

  @doc """
  Filter orders with pagination.
  GET /api/orders/filter?page=1&limit=6&payment_status=pending

  For customers: automatically scoped to their own orders.
  For vendors: automatically scoped to their store orders.
  For admins: can see all orders.
  """
  def filter(conn, params) do
    user = Guardian.Plug.current_resource(conn)

    # Scope filters based on user role
    params =
      case user.role do
        "customer" ->
          Map.put(params, "customer_id", user.id)

        "vendor" ->
          stores = Stores.get_stores_by_vendor(user.id)
          store_ids = Enum.map(stores, & &1.id)

          params
          |> Map.put("vendor_store_ids", store_ids)
          |> Map.put("payment_status", "paid")

        _ ->
          params
      end

    orders =
      case Map.get(params, "vendor_store_ids") do
        nil ->
          Orders.filter_orders(params)

        store_ids ->
          # For vendors, filter orders across all their stores
          Enum.flat_map(store_ids, fn sid ->
            Orders.filter_orders(Map.put(params, "store_id", sid))
          end)
      end

    total =
      case Map.get(params, "vendor_store_ids") do
        nil ->
          Orders.count_filtered_orders(params)

        store_ids ->
          Enum.reduce(store_ids, 0, fn sid, acc ->
            acc + Orders.count_filtered_orders(Map.put(params, "store_id", sid))
          end)
      end

    limit = parse_int(params["limit"], 10)
    page = parse_int(params["page"], 1)

    conn
    |> put_status(:ok)
    |> json(%{
      data: Enum.map(orders, &order_json/1),
      meta: %{
        total: total,
        count: length(orders),
        page: page,
        limit: limit,
        has_more: page * limit < total
      }
    })
  end

  defp order_json(order) do
    %{
      id: order.id,
      total_price: order.total_price,
      delivery_fee: order.delivery_fee,
      payment_status: order.payment_status,
      customer: %{
        id: order.customer.id,
        full_name: order.customer.full_name,
        phone: order.customer.phone_number,
        email: order.customer.email
      },
      store: %{
        id: order.store.id,
        name: order.store.name,
        address: order.store.address,
        phone: order.store.vendor.phone_number
      },
      items: Enum.map(order.order_items, &order_item_json/1),
      order_status: get_order_status(order.order_items),
      created_at: order.inserted_at,
      updated_at: order.updated_at
    }
  end

  defp order_item_json(item) do
    %{
      id: item.id,
      product: %{
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url
      },
      quantity: item.quantity,
      subtotal: item.subtotal,
      status: item.status
    }
  end

  defp get_order_status(order_items) do
    statuses = Enum.map(order_items, & &1.status) |> Enum.uniq()

    cond do
      Enum.empty?(statuses) -> "pending"
      length(statuses) == 1 -> hd(statuses)
      Enum.all?(statuses, &(&1 == "cancelled")) -> "cancelled"
      true -> "mixed"
    end
  end

  defp parse_int(nil, d), do: d

  defp parse_int(val, d) when is_binary(val) do
    case Integer.parse(val) do
      {x, _} -> x
      _ -> d
    end
  end

  defp parse_int(val, _), do: val
end
