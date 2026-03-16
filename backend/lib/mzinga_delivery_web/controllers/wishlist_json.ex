defmodule MzingaDeliveryWeb.WishlistJSON do
  def index(%{wishlist_items: wishlist_items}) do
    %{data: for(item <- wishlist_items, do: data(item))}
  end

  def show(%{wishlist_item: wishlist_item}) do
    %{data: data(wishlist_item)}
  end

  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

  def data(item) do
    %{
      id: item.id,
      inserted_at: item.inserted_at,
      product: product_json(item.product)
    }
  end

  defp product_json(product) do
    %{
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
      stock: product.stock,
      store: %{
        id: product.store.id,
        name: product.store.name
      }
    }
  end
end
