defmodule MzingaDelivery.Delivery.CalculatorTest do
  use ExUnit.Case, async: true
  alias MzingaDelivery.Delivery.Calculator

  describe "calculate_delivery/4" do
    test "calculates distance and fee accurately using fallback when api key is missing" do
      # Note: with no API key or PLACEHOLDER_KEY, it uses the haversine fallback calculations.
      store_lat = -1.2921
      store_lng = 36.8219
      delivery_lat = -1.2800
      delivery_lng = 36.8100

      assert {:ok, result} =
               Calculator.calculate_delivery(store_lat, store_lng, delivery_lat, delivery_lng)

      assert result.distance_km > 0.0
      # the minimum fee
      assert result.fee >= 50.0
      assert is_binary(result.duration_text)
      assert is_binary(result.distance_text)
    end
  end
end
