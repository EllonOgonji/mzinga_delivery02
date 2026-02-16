defmodule MzingaDelivery.Stores.Filters do
  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.Product

  @doc """
  Filters products based on provided parameters.

  ## Parameters
    - category: string (e.g., "Whisky", "Beer")
    - store_id: integer
    - status: string ("active" | "inactive" | "out_of_stock")
    - min_price: decimal
    - max_price: decimal
    - min_rating: decimal (0.0 - 5.0)
    - max_rating: decimal (0.0 - 5.0)
    - specifications: map (e.g., %{"volume" => "750ml", "origin" => "Kenya"})
    - sort_by: string ("price_asc" | "price_desc" | "rating_desc" | "newest")
    - limit: integer (default: 100)
    - offset: integer (default: 0)

  ## Examples

      iex> filter_products(%{"category" => "Whisky", "min_price" => "1000"})
      [%Product{}, ...]

      iex> filter_products(%{"min_rating" => "4.0", "status" => "active"})
      [%Product{}, ...]

      iex> filter_products(%{"specifications" => %{"volume" => "750ml"}})
      [%Product{}, ...]
  """

  def filter_products(params \\ %{}) do
    Product
    |> build_query(params)
    |> apply_sorting(params)
    |> apply_pagination(params)
    |> preload(:store)
    |> Repo.all()
  end

  @doc """
  count total products matching filters(for pagination)
  """
  def count_filtered_products(params \\ %{}) do
    Product
    |> build_query(params)
    |> Repo.aggregate(:count, :id)
  end

  # private fns
  # build dynamic queries based on provided filters
  defp build_query(query, params) do
    query
    |> filter_by_category(params)
    |> filter_by_store(params)
    |> filter_by_status(params)
    |> filter_by_price_range(params)
    |> filter_by_rating_range(params)
    |> filter_by_specifications(params)
    |> filter_by_search(params)
  end

  defp filter_by_category(query, %{"category" => category})
       when is_binary(category) and category != "" do
    from p in query,
      where: p.category == ^category
  end

  defp filter_by_category(query, _), do: query

  defp filter_by_store(query, %{"store_id" => store_id})
       when is_binary(store_id) or is_integer(store_id) do
    store_id = parse_integer(store_id)

    from p in query,
      where: p.store_id == ^store_id
  end

  defp filter_by_store(query, _), do: query

  defp filter_by_status(query, %{"status" => status}) when is_binary(status) and status != "" do
    from p in query,
      where: p.status == ^status
  end

  defp filter_by_status(query, _), do: query

  defp filter_by_price_range(query, params) do
    min_price = parse_decimal(params["min_price"])
    max_price = parse_decimal(params["max_price"])

    query
    |> apply_min_price(min_price)
    |> apply_max_price(max_price)
  end

  defp apply_min_price(query, nil), do: query

  defp apply_min_price(query, min_price) do
    from p in query,
      where: p.price >= ^min_price
  end

  defp apply_max_price(query, nil), do: query

  defp apply_max_price(query, max_price) do
    from p in query,
      where: p.price <= ^max_price
  end

  defp filter_by_rating_range(query, params) do
    min_rating = parse_decimal(params["min_rating"])
    max_rating = parse_decimal(params["max_rating"])

    cond do
      min_rating && max_rating ->
        from p in query,
          where:
            fragment(
              "(SELECT COALESCE(AVG(rating), 0) FROM unnest(?) AS rating) BETWEEN ? AND ?",
              p.ratings,
              ^min_rating,
              ^max_rating
            )

      min_rating ->
        from p in query,
          where:
            fragment(
              "(SELECT COALESCE(AVG(rating), 0) FROM unnest(?) AS rating) >= ?",
              p.ratings,
              ^min_rating
            )

      max_rating ->
        from p in query,
          where:
            fragment(
              "(SELECT COALESCE(AVG(rating), 0) FROM unnest(?) AS rating) <= ?",
              p.ratings,
              ^max_rating
            )

      true ->
        query
    end
  end

  # Filter by specifications (JSONB containment)
  defp filter_by_specifications(query, %{"specifications" => specs})
       when is_map(specs) and specs != %{} do
    from p in query,
      where: fragment("? @> ?::jsonb", p.specifications, ^Jason.encode!(specs))
  end

  defp filter_by_specifications(query, _), do: query

  # Filter by search term (name or description)
  defp filter_by_search(query, %{"search" => search_term})
       when is_binary(search_term) and search_term != "" do
    search_pattern = "%#{search_term}%"

    from p in query,
      where: ilike(p.name, ^search_pattern) or ilike(p.description, ^search_pattern)
  end

  defp filter_by_search(query, _), do: query

  # Apply sorting
  defp apply_sorting(query, %{"sort_by" => "price_asc"}) do
    from p in query, order_by: [asc: p.price]
  end

  defp apply_sorting(query, %{"sort_by" => "price_desc"}) do
    from p in query, order_by: [desc: p.price]
  end

  defp apply_sorting(query, %{"sort_by" => "rating_desc"}) do
    from p in query,
      order_by: [
        desc:
          fragment(
            "(SELECT COALESCE(AVG(rating), 0) FROM unnest(?) AS rating)",
            p.ratings
          )
      ]
  end

  defp apply_sorting(query, %{"sort_by" => "name_asc"}) do
    from p in query, order_by: [asc: p.name]
  end

  defp apply_sorting(query, %{"sort_by" => "name_desc"}) do
    from p in query, order_by: [desc: p.name]
  end

  defp apply_sorting(query, _) do
    # Default: newest first
    from p in query, order_by: [desc: p.inserted_at]
  end

  # Apply pagination
  defp apply_pagination(query, params) do
    limit = parse_integer(params["limit"]) || 100
    offset = parse_integer(params["offset"]) || 0

    query
    |> limit(^limit)
    |> offset(^offset)
  end

  defp parse_integer(nil), do: nil
  defp parse_integer(value) when is_integer(value), do: value

  defp parse_integer(value) when is_binary(value) do
    case Integer.parse(value) do
      {int, _} -> int
      :error -> nil
    end
  end

  defp parse_decimal(nil), do: nil
  defp parse_decimal(value) when is_float(value), do: Decimal.from_float(value)
  defp parse_decimal(value) when is_integer(value), do: Decimal.new(value)

  defp parse_decimal(value) when is_binary(value) do
    case Decimal.parse(value) do
      {decimal, _} -> decimal
      :error -> nil
    end
  end

  defp parse_decimal(%Decimal{} = value), do: value
end
