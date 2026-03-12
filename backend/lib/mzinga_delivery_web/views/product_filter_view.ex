defmodule MzingaDeliveryWeb.ProductFilterView do
  use MzingaDeliveryWeb, :view

  def render("filter.json", %{
        products: products,
        total: total,
        limit: limit,
        offset: offset,
        page: page
      }) do
    %{
      data: Enum.map(products, &product_json/1),
      meta: %{
        total: total,
        count: length(products),
        limit: limit,
        page: page,
        offset: offset,
        has_more: offset + length(products) < total
      }
    }
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
      average_rating: calculate_average_rating(product.ratings),
      total_ratings: length(product.ratings),
      specifications: product.specifications,
      store: %{
        id: product.store.id,
        name: product.store.name,
        logo: product.store.logo
      },
      inserted_at: product.inserted_at,
      updated_at: product.updated_at
    }
  end

  defp calculate_average_rating([]), do: 0

  defp calculate_average_rating(ratings) when is_list(ratings) do
    sum = Enum.reduce(ratings, Decimal.new(0), &Decimal.add/2)
    count = Decimal.new(length(ratings))

    Decimal.div(sum, count)
    |> Decimal.round(1)
    |> Decimal.to_float()
  end

  defp calculate_average_rating(_), do: 0

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
end
