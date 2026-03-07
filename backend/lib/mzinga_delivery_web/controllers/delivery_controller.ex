defmodule MzingaDeliveryWeb.DeliveryController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Delivery.Calculator
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  Calculate delivery fee based on store location and customer drop-off point.
  POST /api/delivery/calculate

  Body:
  {
    "store_id": 1,
    "delivery_lat": "-1.2921",
    "delivery_lng": "36.8219"
  }
  """
  def calculate_fee(conn, %{
        "store_id" => store_id,
        "delivery_lat" => delivery_lat,
        "delivery_lng" => delivery_lng
      }) do
    # Verify user is authenticated
    _user = Guardian.Plug.current_resource(conn)

    case Stores.get_store(store_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      store ->
        store_lat = store.latitude
        store_lng = store.longitude

        if is_nil(store_lat) or is_nil(store_lng) do
          conn
          |> put_status(:bad_request)
          |> json(%{error: "Store does not have valid coordinates configured."})
        else
          case Calculator.calculate_delivery(store_lat, store_lng, delivery_lat, delivery_lng) do
            {:ok, result} ->
              conn
              |> put_status(:ok)
              |> json(%{
                data: %{
                  distance_km: result.distance_km,
                  delivery_fee: result.fee,
                  duration_text: result.duration_text,
                  distance_text: result.distance_text
                }
              })

            {:error, reason} ->
              conn
              |> put_status(:unprocessable_entity)
              |> json(%{error: "Failed to calculate delivery fee", details: inspect(reason)})
          end
        end
    end
  end

  def calculate_fee(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Missing parameters. Required: store_id, delivery_lat, delivery_lng"})
  end
end
