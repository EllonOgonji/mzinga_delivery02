defmodule MzingaDeliveryWeb.StoreFilterController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores.StoreFilters

  def filter(conn, params) do
    stores = StoreFilters.filter_stores(params)
    total = StoreFilters.count_filtered_stores(params)

    conn
    |> put_status(:ok)
    |> json(%{
      data: Enum.map(stores, &store_json/1),
      meta: meta(params, stores, total)
    })
  end

  defp store_json(store) do
    %{
      id: store.id,
      name: store.name,
      status: store.status,
      category: store.category,
      is_verified: store.is_verified,
      inserted_at: store.inserted_at,
      updated_at: store.updated_at
    }
  end

  defp meta(params, stores, total) do
    limit = parse_int(params["limit"], 50)
    offset = parse_int(params["offset"], 0)

    %{
      total: total,
      count: length(stores),
      limit: limit,
      offset: offset,
      has_more: offset + length(stores) < total
    }
  end

  defp parse_int(nil, d), do: d

  defp parse_int(val, d) when is_binary(val) do
    case Integer.parse(val) do
      {x, _} -> x
      _ -> d
    end
  end

  defp parse_int(val, _), do: val
end
