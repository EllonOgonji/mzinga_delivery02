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
      compare_at_price: product.compare_at_price,
      discount_percentage: calculate_discount(product.price, product.compare_at_price),
      stock: product.stock,
      image_url: product.image_url,
      category: product.category,
      status: product.status,
      ratings: product.ratings,
      average_rating: calculate_average(product.ratings),
      total_ratings: length(product.ratings),
      specifications: product.specifications,
      store_id: product.store_id,
      store: render_store(product.store),
      inserted_at: product.inserted_at,
      updated_at: product.updated_at
    }
  end

  defp render_store(%Ecto.Association.NotLoaded{}), do: nil
  defp render_store(nil), do: nil

  defp render_store(store) do
    %{
      id: store.id,
      name: store.name,
      logo: store.logo
    }
  end

  defp calculate_average([]), do: 0

  defp calculate_average(ratings) when is_list(ratings) do
    sum = Enum.reduce(ratings, Decimal.new(0), &Decimal.add/2)
    count = Decimal.new(length(ratings))
    Decimal.div(sum, count) |> Decimal.round(1) |> Decimal.to_float()
  end

  defp calculate_average(_), do: 0

  defp calculate_discount(_, nil), do: 0

  defp calculate_discount(price, compare_at_price) do
    if Decimal.compare(compare_at_price, price) == :gt do
      discount = Decimal.sub(compare_at_price, price)
      percentage = Decimal.div(discount, compare_at_price)

      Decimal.mult(percentage, Decimal.new(100))
      |> Decimal.round(0)
      |> Decimal.to_integer()
    else
      0
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
