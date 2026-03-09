defmodule MzingaDeliveryWeb.Admin.StoreControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Accounts

  @valid_store_attrs %{
    name: "Test Store",
    address: "123 Main St",
    latitude: 1.23,
    longitude: 4.56,
    category: "General"
  }

  setup %{conn: conn} do
    # Create an admin user
    {:ok, admin} =
      Accounts.create_user(%{
        full_name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "admin",
        phone_number: "254700000000"
      })

    # Create a vendor user
    {:ok, vendor} =
      Accounts.create_user(%{
        full_name: "Vendor User",
        email: "vendor@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor",
        phone_number: "254700000001"
      })

    # Log in as admin
    {:ok, token, _claims} = MzingaDelivery.Auth.Guardian.encode_and_sign(admin)
    conn = put_req_header(conn, "authorization", "Bearer #{token}")

    {:ok, conn: conn, vendor: vendor}
  end

  describe "update store coordinates" do
    test "admin can update latitude and longitude of an existing store", %{
      conn: conn,
      vendor: vendor
    } do
      # Create a store first
      {:ok, store} = Stores.create_store(Map.put(@valid_store_attrs, :vendor_id, vendor.id))

      # New coordinates
      new_latitude = -1.2921
      new_longitude = 36.8219

      update_attrs = %{
        "latitude" => new_latitude,
        "longitude" => new_longitude
      }

      # Perform the PATCH request
      conn = patch(conn, ~p"/api/admin/stores/#{store.id}", store: update_attrs)

      # Assert the response
      assert %{"id" => id} = json_response(conn, 200)["data"]

      # Verify the database updated
      updated_store = Stores.get_store!(id)
      assert Decimal.eq?(updated_store.latitude, Decimal.new(to_string(new_latitude)))
      assert Decimal.eq?(updated_store.longitude, Decimal.new(to_string(new_longitude)))
    end
  end
end
