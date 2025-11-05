defmodule MzingaDeliveryWeb.ProductView do
  use MzingaDeliveryWeb, :view

  def render("index.json", %{products: products}) do
    %{data: Enum.map(products, &product_json/1)}
  end

  def render("show.json", %{product: product}) do
    %{data: product_json(product)}
  end

  def render("error.json", %{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp product_json(product) do
    %{
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      category: product.category,
      store_id: product.store_id,
      inserted_at: product.inserted_at,
      updated_at: product.updated_at
    }
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
