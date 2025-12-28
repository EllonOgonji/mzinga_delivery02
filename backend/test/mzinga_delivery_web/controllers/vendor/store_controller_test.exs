defmodule MzingaDeliveryWeb.Vendor.StoreControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  setup do
    {:ok, user} =
      Accounts.create_user(%{
        full_name: "Vendor One",
        email: "vendor@example.com",
        phone_number: "254700000000",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor"
      })

    {:ok, token, _claims} = Guardian.encode_and_sign(user)
    conn = put_req_header(build_conn(), "authorization", "Bearer #{token}")

    %{conn: conn, user: user}
  end

  test "creates store and renders store when data is valid", %{conn: conn} do
    store_params = %{
      name: "My New Store",
      address: "123 Test St",
      latitude: -1.2,
      longitude: 36.8,
      logo: "http://example.com/logo.png",
      banner: "http://example.com/banner.png",
      category: "Liquor Store"
    }

    conn = post(conn, ~p"/api/vendor/stores", store: store_params)
    assert %{"id" => _id} = json_response(conn, 201)["data"]
  end
end
