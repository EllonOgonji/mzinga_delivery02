defmodule MzingaDeliveryWeb.CartJSON do
  alias MzingaDelivery.Carts.Cart
  alias MzingaDelivery.Carts.CartItem

  @doc """
  Renders a single cart.
  """
  def show(%{cart: cart}) do
    %{data: data(cart)}
  end

  @doc """
  Renders error from changeset or other reason.
  """
  def error(%{changeset: changeset}) do
    %{errors: Ecto.Changeset.traverse_errors(changeset, &translate_error/1)}
  end

  def error(%{message: message}) do
    %{error: message}
  end

  defp data(%Cart{} = cart) do
    %{
      id: cart.id,
      user_id: cart.user_id,
      # store_id might be nil now for multi-store carts
      store_id: cart.store_id,
      total_price: cart.total_price,
      items: Enum.map(cart.items, &item_data/1)
    }
  end

  defp data(nil), do: nil

  defp item_data(%CartItem{} = item) do
    %{
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      product: product_data(item.product)
    }
  end

  defp product_data(%Ecto.Association.NotLoaded{}), do: nil
  defp product_data(nil), do: nil
  defp product_data(product) do
    %{
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      store_id: product.store_id
    }
  end

  defp translate_error({msg, opts}) do
    Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
      opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
    end)
  end
end
