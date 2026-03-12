defmodule MzingaDeliveryWeb.ProductFilterController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores

  require Logger

  @doc """
  Filter products endpoint
  GET /api/products/filter

  Query Parameters:
  - category: string
  - store_id: integer
  - status: string
  - min_price: decimal
  - max_price: decimal
  - min_rating: decimal
  - max_rating: decimal
  - search: string
  - sort_by: string (price_asc, price_desc, rating_desc, newest)
  - limit: integer (default: 100)
  - offset: integer (default: 0)
  - spec_<key>: string (e.g., spec_volume=750ml, spec_origin=Kenya)
  """
  def filter(conn, params) do
    Logger.info("Filter request received with params: #{inspect(params)}")

    # Convert specification parameters (spec_*) into specifications map
    filter_params = build_filter_params(params)

    # Get filtered products
    products = Stores.filter_products(filter_params)
    total_count = Stores.count_filtered_products(filter_params)

    Logger.info("Found #{length(products)} products, total matching: #{total_count}")

    limit = parse_int(params["limit"], 100)
    page = parse_int(params["page"], 1)
    offset = parse_int(params["offset"], (page - 1) * limit)

    conn
    |> put_status(:ok)
    |> render("filter.json",
      products: products,
      total: total_count,
      limit: limit,
      page: page,
      offset: offset
    )
  end

  @doc """
  Get available filter options (categories, price range)
  GET /api/products/filter/options
  """
  def filter_options(conn, _params) do
    categories = Stores.list_categories()
    price_range = Stores.get_price_range()

    conn
    |> put_status(:ok)
    |> json(%{
      data: %{
        categories: categories,
        price_range: %{
          min: price_range.min_price,
          max: price_range.max_price
        },
        statuses: ["active", "inactive", "out_of_stock"],
        sort_options: [
          %{value: "newest", label: "Newest First"},
          %{value: "price_asc", label: "Price: Low to High"},
          %{value: "price_desc", label: "Price: High to Low"},
          %{value: "rating_desc", label: "Highest Rated"},
          %{value: "name_asc", label: "Name: A to Z"},
          %{value: "name_desc", label: "Name: Z to A"}
        ]
      }
    })
  end

  # private fns
  # Build filter params, converting spec_* params to specifications map
  defp build_filter_params(params) do
    specifications = extract_specifications(params)

    params
    |> Map.drop(get_spec_keys(params))
    |> Map.put("specifications", specifications)
    |> Enum.reject(fn {_k, v} -> is_nil(v) || v == "" end)
    |> Map.new()
  end

  # Extract specification parameters (spec_volume, spec_origin, etc.)
  defp extract_specifications(params) do
    params
    |> Enum.filter(fn {key, _value} -> String.starts_with?(key, "spec_") end)
    |> Enum.map(fn {"spec_" <> key, value} -> {key, value} end)
    |> Map.new()
  end

  # Get all spec_* keys from params
  defp get_spec_keys(params) do
    params
    |> Map.keys()
    |> Enum.filter(&String.starts_with?(&1, "spec_"))
  end

  defp parse_int(nil, default), do: default

  defp parse_int(value, default) when is_binary(value) do
    case Integer.parse(value) do
      {int, _} -> int
      :error -> default
    end
  end

  defp parse_int(value, _default) when is_integer(value), do: value
end
