defmodule MzingaDelivery.Stores.StoreFilters do
  @moduledoc """
  Dynamic filtering system for stores.
  Supports name, category, status, minimum rating, metadata, verification, sorting, pagination.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.{Store, Product}

  @doc """
  Filters stores based on provided parameters for public users.
  Only returns approved and verified stores.

  ## Parameters
    - name: string (partial match)
    - category: string (exact match or nil)
    - status: string
    - min_rating: decimal
    - is_verified: boolean ("true" or "false")
    - metadata: map (JSONB containment)
    - sort_by: string (name_asc, name_desc, rating_desc, newest)
    - limit: integer (default: 50)
    - offset: integer (default: 0)
  """
  def filter_stores(params \\ %{}) do
    Store
    |> where([s], s.status == "approved" and s.is_verified == true)
    |> build_query(params)
    |> apply_sorting(params)
    |> apply_pagination(params)
    |> preload(:vendor)
    |> Repo.all()
  end

  @doc """
  Count total stores matching filters for public users.
  """
  def count_filtered_stores(params \\ %{}) do
    Store
    |> where([s], s.status == "approved" and s.is_verified == true)
    |> build_query(params)
    |> Repo.aggregate(:count, :id)
  end

  @doc """
  Filters stores based on provided parameters for admins.
  Allows fetching any status or verification state.
  """
  def filter_admin_stores(params \\ %{}) do
    Store
    |> build_query(params)
    |> apply_sorting(params)
    |> apply_pagination(params)
    |> preload(:vendor)
    |> Repo.all()
  end

  @doc """
  Count total stores matching filters for admins.
  """
  def count_filtered_admin_stores(params \\ %{}) do
    Store
    |> build_query(params)
    |> Repo.aggregate(:count, :id)
  end

  # ========== PRIVATE FUNCTIONS ==========

  # Build query with filters
  defp build_query(query, params) do
    query
    |> filter_by_name(params)
    |> filter_by_category(params)
    |> filter_by_status(params)
    |> filter_by_verification(params)
    |> filter_by_min_rating(params)
    |> filter_by_metadata(params)
  end

  # Name filter (partial match, case-insensitive)
  defp filter_by_name(query, params) do
    name = params["name"] || params["search"]

    if is_binary(name) and name != "" do
      pattern = "%#{name}%"
      from s in query, where: ilike(s.name, ^pattern)
    else
      query
    end
  end

  # ==================================

  defp apply_pagination(query, params) do
    limit = parse_integer(params["limit"]) || 50
    offset = parse_integer(params["offset"])

    offset =
      if is_nil(offset) do
        page = parse_integer(params["page"]) || 1
        (page - 1) * limit
      else
        offset
      end

    query
    |> limit(^limit)
    |> offset(^offset)
  end

  # Category filter
  defp filter_by_category(query, %{"category" => category})
       when is_binary(category) and category != "" do
    from s in query,
      where: s.category == ^category or is_nil(s.category)
  end

  defp filter_by_category(query, _), do: query

  # Status filter
  defp filter_by_status(query, %{"status" => status}) when is_binary(status) and status != "" do
    from s in query, where: s.status == ^status
  end

  defp filter_by_status(query, _), do: query

  # Verification filter
  defp filter_by_verification(query, %{"is_verified" => "true"}) do
    from s in query, where: s.is_verified == true
  end

  defp filter_by_verification(query, %{"is_verified" => "false"}) do
    from s in query, where: s.is_verified == false
  end

  defp filter_by_verification(query, _), do: query

  # Minimum rating filter
  # Calculates average rating from products associated with the store
  defp filter_by_min_rating(query, %{"min_rating" => rating}) when rating not in [nil, ""] do
    case parse_decimal(rating) do
      nil ->
        query

      parsed ->
        from s in query,
          left_join: p in Product,
          on: p.store_id == s.id,
          group_by: s.id,
          having:
            fragment(
              "COALESCE(AVG((SELECT COALESCE(AVG(rating), 0) FROM unnest(?::numeric[]) AS rating)), 0) >= ?",
              p.ratings,
              ^parsed
            )
    end
  end

  defp filter_by_min_rating(query, _), do: query

  # Metadata filter (JSONB containment)
  # Note: Requires 'metadata' column to exist as JSONB in stores table
  defp filter_by_metadata(query, %{"metadata" => meta}) when is_map(meta) and meta != %{} do
    from s in query,
      where: fragment("? @> ?::jsonb", s.metadata, ^Jason.encode!(meta))
  end

  defp filter_by_metadata(query, _), do: query

  # ========== SORTING ==========

  defp apply_sorting(query, %{"sort_by" => "name_asc"}) do
    from s in query, order_by: [asc: s.name]
  end

  defp apply_sorting(query, %{"sort_by" => "name_desc"}) do
    from s in query, order_by: [desc: s.name]
  end

  defp apply_sorting(query, %{"sort_by" => "rating_desc"}) do
    from s in query,
      left_join: p in Product,
      on: p.store_id == s.id,
      group_by: s.id,
      order_by: [
        desc:
          fragment(
            "COALESCE(AVG((SELECT COALESCE(AVG(rating), 0) FROM unnest(?::numeric[]) AS rating)), 0)",
            p.ratings
          )
      ]
  end

  # Default sorting: newest first
  defp apply_sorting(query, _) do
    from s in query, order_by: [desc: s.inserted_at]
  end

  # ========== HELPERS ==========

  defp parse_integer(nil), do: nil
  defp parse_integer(v) when is_integer(v), do: v

  defp parse_integer(v) when is_binary(v) do
    case Integer.parse(v) do
      {x, _} -> x
      :error -> nil
    end
  end

  defp parse_integer(_), do: nil

  defp parse_decimal(nil), do: nil
  defp parse_decimal(%Decimal{} = v), do: v
  defp parse_decimal(v) when is_float(v), do: Decimal.from_float(v)
  defp parse_decimal(v) when is_integer(v), do: Decimal.new(v)

  defp parse_decimal(v) when is_binary(v) do
    case Decimal.parse(v) do
      {d, _} -> d
      :error -> nil
    end
  end

  defp parse_decimal(_), do: nil
end
