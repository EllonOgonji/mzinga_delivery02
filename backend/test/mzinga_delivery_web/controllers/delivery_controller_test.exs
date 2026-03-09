defmodule MzingaDeliveryWeb.DeliveryControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  setup %{conn: conn} do
    {:ok, user} =
      Accounts.create_user(%{
        full_name: "Customer One",
        email: "customer@example.com",
        phone_number: "254700000001",
        password: "password123",
        password_confirmation: "password123",
        role: "customer"
      })

    {:ok, token, _claims} = Guardian.encode_and_sign(user)
    conn = put_req_header(conn, "authorization", "Bearer #{token}")

    # Create a vendor to own the store
    {:ok, vendor} =
      Accounts.create_user(%{
        full_name: "Vendor Owner",
        email: "vendor2@example.com",
        phone_number: "254700000002",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor"
      })

    {:ok, store} =
      Stores.create_vendor_store(vendor.id, %{
        "name" => "Delivery Store",
        "address" => "Some place",
        "latitude" => -1.2921,
        "longitude" => 36.8219,
        "category" => "Liquor Store"
      })

    %{conn: conn, user: user, store: store}
  end

  describe "calculate_fee/2" do
    test "returns delivery calculation when valid params are provided", %{
      conn: conn,
      store: store
    } do
      params = %{
        "store_id" => store.id,
        "delivery_lat" => "-1.2800",
        "delivery_lng" => "36.8100"
      }

      conn = post(conn, ~p"/api/delivery/calculate", params)
      response = json_response(conn, 200)["data"]

      assert response["distance_km"]
      assert response["delivery_fee"]
      assert response["duration_text"]
      assert response["distance_text"]
    end

    test "returns 404 when store does not exist", %{conn: conn} do
      params = %{
        "store_id" => -1,
        "delivery_lat" => "-1.2800",
        "delivery_lng" => "36.8100"
      }

      conn = post(conn, ~p"/api/delivery/calculate", params)
      assert json_response(conn, 404)
    end

    test "returns 400 when missing parameters", %{conn: conn, store: store} do
      params = %{
        "store_id" => store.id
        # missing delivery_lat/lng
      }

      conn = post(conn, ~p"/api/delivery/calculate", params)

      assert json_response(conn, 400)["error"] ==
               "Missing parameters. Required: store_id, delivery_lat, delivery_lng"
    end
  end
end
