defmodule MzingaDeliveryWeb.ProductJSON do
  def index(%{products: products}) do
    %{data: Enum.map(products, &product_json/1)}
  end

  def show(%{product: product}) do
    %{data: product_json(product)}
  end

  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp product_json(product) do
    %{
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compare_at_price: product.compare_at_price,
      stock: product.stock,
      image_url: product.image_url,
      category: product.category,
      status: product.status,
      ratings: product.ratings,
      average_rating: calculate_average(product.ratings),
      specifications: product.specifications,
      store_id: product.store_id,
      inserted_at: product.inserted_at,
      updated_at: product.updated_at
    }
  end

  defp calculate_average([]), do: 0

  defp calculate_average(ratings) when is_list(ratings) do
    sum = Enum.reduce(ratings, Decimal.new(0), &Decimal.add/2)
    count = Decimal.new(length(ratings))
    Decimal.div(sum, count) |> Decimal.round(1) |> Decimal.to_float()
  end

  defp calculate_average(_), do: 0

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end
