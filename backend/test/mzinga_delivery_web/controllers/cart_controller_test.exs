defmodule MzingaDeliveryWeb.CartControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  setup %{conn: conn} do
    # Create customer
    {:ok, user} =
      Accounts.create_user(%{
        full_name: "Cart Customer",
        email: "cart_customer@example.com",
        phone_number: "254700000030",
        password: "password123",
        password_confirmation: "password123",
        role: "customer"
      })

    # Create vendor and store
    {:ok, vendor} =
      Accounts.create_user(%{
        full_name: "Cart Vendor",
        email: "cart_vendor@example.com",
        phone_number: "254700000031",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor"
      })

    {:ok, store} =
      Stores.create_store(%{
        vendor_id: vendor.id,
        name: "Cart Test Store",
        address: "Test Address",
        latitude: 1.0,
        longitude: 1.0,
        category: "General"
      })

    # Create product with limited stock
    {:ok, product} =
      Stores.create_product(%{
        store_id: store.id,
        name: "In Stock Product",
        description: "Test Description",
        price: 150.0,
        stock: 5,
        category: "General"
      })

    {:ok, token, _} = Guardian.encode_and_sign(user)
    conn = put_req_header(conn, "authorization", "Bearer #{token}")

    {:ok, conn: conn, user: user, product: product}
  end

  describe "POST /api/cart/items" do
    test "adds product to cart when stock is sufficient", %{conn: conn, product: product} do
      conn = post(conn, ~p"/api/cart/items", %{product_id: product.id, quantity: 3})
      assert json_response(conn, 201)

      # Check if cart total updated
      conn =
        get(
          build_conn()
          |> put_req_header(
            "authorization",
            get_req_header(conn, "authorization") |> List.first()
          ),
          ~p"/api/cart"
        )

      assert json_response(conn, 200)["data"]["total_price"] == "450.00"
    end

    test "fails to add product to cart when stock is insufficient", %{
      conn: conn,
      product: product
    } do
      conn = post(conn, ~p"/api/cart/items", %{product_id: product.id, quantity: 10})

      response = json_response(conn, 422)
      assert response["error"] == "Product is out of stock"
      assert response["code"] == "OUT_OF_STOCK"
    end
  end
end
