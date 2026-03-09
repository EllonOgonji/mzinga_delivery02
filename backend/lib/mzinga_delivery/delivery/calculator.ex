defmodule MzingaDelivery.Delivery.Calculator do
  @moduledoc """
  Calculates delivery fees using the Google Maps Distance Matrix API.
  Formula: (Fuel + Maintenance + Rider Pay) * Distance in km
  """

  require Logger

  # Default rates if not set in config
  @default_fuel 15
  @default_maintenance 5
  @default_rider_pay 20

  defp config do
    Application.get_env(:mzinga_delivery, :delivery, [])
  end

  defp get_rate(key, default) do
    Keyword.get(config(), key, default)
  end

  defp api_key do
    Keyword.get(config(), :google_maps_api_key)
  end

  @doc """
  Calculates the delivery distance and fee between a store and a destination.
  Returns `{:ok, %{distance_km: float, fee: float, duration_text: string}}` or `{:error, reason}`
  """
  def calculate_delivery(store_lat, store_lng, delivery_lat, delivery_lng) do
    with {:ok, distance_data} <-
           get_distance_from_google(store_lat, store_lng, delivery_lat, delivery_lng) do
      distance_km = distance_data.distance_meters / 1000.0
      fee = calculate_fee_from_distance(distance_km)

      {:ok,
       %{
         distance_km: Float.round(distance_km, 2),
         fee: Float.round(fee, 2),
         duration_text: distance_data.duration_text,
         distance_text: distance_data.distance_text
       }}
    end
  end

  defp calculate_fee_from_distance(distance_km) do
    fuel = get_rate(:fuel_rate_per_km, @default_fuel)
    maintenance = get_rate(:maintenance_rate_per_km, @default_maintenance)
    rider_pay = get_rate(:rider_pay_per_km, @default_rider_pay)

    # Base cost per km formula
    cost_per_km = fuel + maintenance + rider_pay

    # Calculate total and ensure there's a minimum sensible fee
    total = cost_per_km * distance_km

    # Optional: Set a minimum delivery fee, e.g., 50 KES.
    max(total, 50.0)
  end

  defp get_distance_from_google(origin_lat, origin_lng, dest_lat, dest_lng) do
    key = api_key()

    if is_nil(key) or key == "PLACEHOLDER_KEY" do
      Logger.warning(
        "Google Maps API Key not configured. Using fallback calculation (straight line distance estimation)."
      )

      fallback_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    else
      origins = "#{origin_lat},#{origin_lng}"
      destinations = "#{dest_lat},#{dest_lng}"

      url =
        "https://maps.googleapis.com/maps/api/distancematrix/json?origins=#{origins}&destinations=#{destinations}&key=#{key}"

      case HTTPoison.get(url, [], timeout: 10_000, recv_timeout: 10_000) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          parse_google_response(body)

        {:ok, %HTTPoison.Response{status_code: code, body: body}} ->
          Logger.error("Google Maps API returned #{code}: #{body}")
          {:error, :api_error}

        {:error, %HTTPoison.Error{reason: reason}} ->
          Logger.error("HTTP Request to Google Maps failed: #{inspect(reason)}")
          {:error, :network_error}
      end
    end
  end

  defp parse_google_response(body) do
    case Jason.decode(body) do
      {:ok, %{"status" => "OK", "rows" => [%{"elements" => [%{"status" => "OK"} = element]}]}} ->
        distance_meters = element["distance"]["value"]
        distance_text = element["distance"]["text"]
        duration_text = element["duration"]["text"]

        {:ok,
         %{
           distance_meters: distance_meters,
           distance_text: distance_text,
           duration_text: duration_text
         }}

      {:ok, response} ->
        Logger.error("Google Maps API error or route not found: #{inspect(response)}")
        {:error, :route_not_found}

      {:error, _} ->
        Logger.error("Failed to parse Google Maps JSON response")
        {:error, :json_parse_error}
    end
  end

  # Fallback: Approximate Haversine formula for testing when API key is not set
  defp fallback_distance(lat1, lon1, lat2, lon2) do
    lat1_rad = to_float(lat1) * :math.pi() / 180
    lon1_rad = to_float(lon1) * :math.pi() / 180
    lat2_rad = to_float(lat2) * :math.pi() / 180
    lon2_rad = to_float(lon2) * :math.pi() / 180

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a =
      :math.pow(:math.sin(dlat / 2), 2) +
        :math.cos(lat1_rad) * :math.cos(lat2_rad) * :math.pow(:math.sin(dlon / 2), 2)

    c = 2 * :math.asin(:math.sqrt(a))
    # Radius of earth in kilometers
    r = 6371

    # Straight line distance * 1.4 to roughly approximate road distance
    approx_road_distance_km = c * r * 1.4
    distance_meters = trunc(approx_road_distance_km * 1000)

    {:ok,
     %{
       distance_meters: distance_meters,
       distance_text: "#{Float.round(approx_road_distance_km, 1)} km (Est)",
       duration_text: "#{trunc(approx_road_distance_km * 3)} mins (Est)"
     }}
  end

  defp to_float(val) when is_float(val), do: val
  defp to_float(val) when is_integer(val), do: val * 1.0
  defp to_float(%Decimal{} = val), do: Decimal.to_float(val)

  defp to_float(val) when is_binary(val) do
    case Float.parse(val) do
      {f, _} -> f
      :error -> 0.0
    end
  end
end
