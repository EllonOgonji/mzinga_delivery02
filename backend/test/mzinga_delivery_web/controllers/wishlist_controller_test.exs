defmodule MzingaDeliveryWeb.WishlistControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Stores

  setup %{conn: conn} do
    # Create a customer user
    {:ok, user} =
      Accounts.create_user(%{
        full_name: "Customer One",
        email: "customer_wishlist@example.com",
        phone_number: "254700000020",
        password: "password123",
        password_confirmation: "password123",
        role: "customer"
      })

    # Create a vendor and a store
    {:ok, vendor} =
      Accounts.create_user(%{
        full_name: "Vendor One",
        email: "vendor_wishlist@example.com",
        phone_number: "254700000021",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor"
      })

    {:ok, store} =
      Stores.create_store(%{
        vendor_id: vendor.id,
        name: "Wishlist Test Store",
        address: "Test Address",
        latitude: 1.0,
        longitude: 1.0,
        category: "General"
      })

    # Create a product
    {:ok, product} =
      Stores.create_product(%{
        store_id: store.id,
        name: "Test Product",
        description: "Test Description",
        price: 100.0,
        stock: 50,
        category: "General"
      })

    # Log in as user
    {:ok, token, _} = MzingaDelivery.Auth.Guardian.encode_and_sign(user)
    conn = put_req_header(conn, "authorization", "Bearer #{token}")

    {:ok, conn: conn, user: user, product: product}
  end

  describe "POST /api/wishlist/:product_id" do
    test "adds a product to wishlist", %{conn: conn, product: product} do
      conn = post(conn, ~p"/api/wishlist/#{product.id}")
      assert %{"id" => _id, "product" => %{"id" => p_id}} = json_response(conn, 201)["data"]
      assert p_id == product.id
    end

    test "cannot add the same product twice", %{conn: conn, user: user, product: product} do
      Accounts.add_to_wishlist(user.id, product.id)
      conn = post(conn, ~p"/api/wishlist/#{product.id}")
      assert json_response(conn, 422)["errors"]["product_id"] == ["has already been taken"]
    end
  end

  describe "GET /api/wishlist" do
    test "lists wishlist items", %{conn: conn, user: user, product: product} do
      Accounts.add_to_wishlist(user.id, product.id)
      conn = get(conn, ~p"/api/wishlist")
      data = json_response(conn, 200)["data"]
      assert length(data) == 1
      assert List.first(data)["product"]["id"] == product.id
    end
  end

  describe "DELETE /api/wishlist/:product_id" do
    test "removes a product from wishlist", %{conn: conn, user: user, product: product} do
      Accounts.add_to_wishlist(user.id, product.id)
      conn = delete(conn, ~p"/api/wishlist/#{product.id}")
      assert response(conn, 204) == ""
      assert Accounts.list_wishlist_items(user.id) == []
    end

    test "returns 404 if item not in wishlist", %{conn: conn} do
      conn = delete(conn, ~p"/api/wishlist/999999")
      assert json_response(conn, 404)["error"] == "Item not found in wishlist"
    end
  end
end
