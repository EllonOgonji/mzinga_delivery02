defmodule MzingaDeliveryWeb.OrderJSON do
  def index(%{orders: orders}) do
    %{data: Enum.map(orders, &order_json/1)}
  end

  def show(%{order: order} = assigns) do
    response = %{data: order_json(order)}

    case Map.get(assigns, :mpesa_response) do
      nil -> response
      mpesa -> Map.put(response, :payment, mpesa)
    end
  end

  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp order_json(order) do
    %{
      id: order.id,
      total_price: order.total_price,
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
      length(statuses) == 1 -> hd(statuses)
      Enum.all?(statuses, &(&1 == "cancelled")) -> "cancelled"
      true -> "mixed"
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
