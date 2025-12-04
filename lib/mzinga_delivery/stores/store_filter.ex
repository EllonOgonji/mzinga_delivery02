defmodule MzingaDelivery.Stores.StoreFilters do
  @moduledoc """
  Dynamic filtering system for stores.
  Supports name, status, minimum rating, metadata, sorting, pagination.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.{Store, Product}

  # Public API
  def filter_stores(params \\ %{}) do
    Store
    |> build_query(params)
    |> apply_sorting(params)
    |> apply_pagination(params)
    |> Repo.all()
  end

  def count_filtered_stores(params \\ %{}) do
    Store
    |> build_query(params)
    |> Repo.aggregate(:count, :id)
  end

  # Build query with filters
  defp build_query(query, params) do
    query
    |> filter_by_name(params)
    |> filter_by_status(params)
    |> filter_by_min_rating(params)
    |> filter_by_metadata(params)
    |> filter_by_verification(params)
  end

  # Name filter
  defp filter_by_name(query, %{"name" => name}) when name != "" do
    from s in query, where: ilike(s.name, ^"%#{name}%")
  end

  defp filter_by_name(query, _), do: query

  # Status filter
  defp filter_by_status(query, %{"status" => status}) when status != "" do
    from s in query, where: s.status == ^status
  end

  defp filter_by_status(query, _), do: query

  # Minimum rating filter: join products and compute average of per-product averages
  defp filter_by_min_rating(query, %{"min_rating" => rating}) when rating not in [nil, ""] do
    case parse_decimal(rating) do
      nil ->
        query

      parsed ->
        from s in query,
          join: p in Product,
          on: p.store_id == s.id,
          group_by: s.id,
          having:
            fragment(
              "COALESCE(AVG((SELECT AVG(r) FROM unnest(?::numeric[]) r)), 0) >= ?",
              p.ratings,
              ^parsed
            )
    end
  end

  defp filter_by_min_rating(query, _), do: query

  # Metadata filter
  defp filter_by_metadata(query, %{"metadata" => meta}) when is_map(meta) and meta != %{} do
    from s in query,
      where: fragment("? @> ?::jsonb", s.metadata, ^Jason.encode!(meta))
  end

  defp filter_by_metadata(query, _), do: query

  # Sorting
  defp apply_sorting(query, %{"sort_by" => "name_asc"}),
    do: from(s in query, order_by: [asc: s.name])

  defp apply_sorting(query, %{"sort_by" => "name_desc"}),
    do: from(s in query, order_by: [desc: s.name])

  defp apply_sorting(query, %{"sort_by" => "rating_desc"}) do
    from s in query,
      join: p in Product,
      on: p.store_id == s.id,
      group_by: s.id,
      order_by: [
        desc: fragment("COALESCE(AVG((SELECT AVG(r) FROM unnest(?::numeric[]) r)), 0)", p.ratings)
      ]
  end

  # Default sorting
  defp apply_sorting(query, _), do: from(s in query, order_by: [desc: s.inserted_at])

  # Pagination
  defp apply_pagination(query, params) do
    limit = parse_integer(params["limit"]) || 50
    offset = parse_integer(params["offset"]) || 0

    query
    |> limit(^limit)
    |> offset(^offset)
  end

  # Helpers
  defp parse_integer(nil), do: nil

  defp parse_integer(v) when is_binary(v) do
    case Integer.parse(v) do
      {x, _} -> x
      _ -> nil
    end
  end

  defp parse_integer(v), do: v

  defp parse_decimal(nil), do: nil

  defp parse_decimal(%Decimal{} = v), do: v

  defp parse_decimal(v) when is_binary(v) do
    case Decimal.parse(v) do
      {d, _} -> d
      _ -> nil
    end
  end

  defp parse_decimal(v) do
    Decimal.new(v)
  end

  defp filter_by_verification(query, %{"is_verified" => "true"}) do
    from s in query,
      where: s.is_verified == true
  end

  defp filter_by_verification(query, %{"is_verified" => "false"}) do
    from s in query,
      where: s.is_verified == false
  end

  defp filter_by_verification(query, _), do: query
end
