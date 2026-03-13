defmodule MzingaDeliveryWeb.ProductControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth
  alias MzingaDelivery.Accounts

  setup %{conn: conn} do
    # Create a vendor user
    # Phone number must be exactly 12 digits starting with 254
    phone_number = "2547" <> (Enum.random(10_000_000..99_999_999) |> to_string())

    {:ok, user} =
      Accounts.create_user(%{
        "email" => "vendor_#{System.unique_integer([:positive])}@example.com",
        "password" => "password123",
        "password_confirmation" => "password123",
        "full_name" => "Test Vendor",
        "phone_number" => phone_number,
        "role" => "vendor"
      })

    # Create a store for the vendor
    store_phone = "2547" <> (Enum.random(10_000_000..99_999_999) |> to_string())

    {:ok, store} =
      Stores.create_store(%{
        "name" => "Test Store #{System.unique_integer([:positive])}",
        "description" => "A test store",
        "category" => "Liquor Store",
        "address" => "123 Street",
        "phone" => store_phone,
        "vendor_id" => user.id,
        "status" => "approved",
        "is_verified" => true,
        "latitude" => -1.286389,
        "longitude" => 36.817223
      })

    # Get token for the vendor
    {:ok, token, _claims} = Auth.Guardian.encode_and_sign(user)

    conn =
      conn
      |> put_req_header("authorization", "Bearer " <> token)
      |> put_req_header("accept", "application/json")

    {:ok, conn: conn, vendor: user, store: store}
  end

  describe "create product" do
    test "renders product when data is valid", %{conn: conn, store: store} do
      product_params = %{
        "name" => "New Product",
        "description" => "Product description",
        "price" => "150.50",
        "stock" => 20,
        "category" => "Electronics",
        "store_id" => store.id
      }

      conn = post(conn, ~p"/api/products", product: product_params)

      # If it returns 201, the fix works. If it returns 500, it fails.
      assert %{"id" => _id, "store" => %{"id" => returned_store_id}} =
               json_response(conn, 201)["data"]

      assert returned_store_id == store.id
    end
  end
end
