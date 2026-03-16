defmodule MzingaDeliveryWeb.OrderControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Orders
  alias MzingaDelivery.Stores
  alias MzingaDelivery.Repo

  setup %{conn: conn} do
    # Create a customer user
    {:ok, customer} =
      Accounts.create_user(%{
        full_name: "Customer User",
        email: "customer_orders@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "customer",
        phone_number: "254700000010"
      })

    # Create a vendor user
    {:ok, vendor} =
      Accounts.create_user(%{
        full_name: "Vendor User",
        email: "vendor_orders@example.com",
        password: "password123",
        password_confirmation: "password123",
        role: "vendor",
        phone_number: "254700000011"
      })

    # Create a store
    {:ok, store} =
      Stores.create_store(%{
        vendor_id: vendor.id,
        name: "Order Test Store",
        address: "Test Address",
        latitude: 1.0,
        longitude: 1.0,
        category: "General"
      })

    {:ok, customer: customer, vendor: vendor, store: store}
  end

  describe "Order Visibility" do
    test "customer can see their own UNPAID orders", %{
      conn: conn,
      customer: customer,
      store: store
    } do
      {:ok, order} =
        Orders.create_order(%{
          customer_id: customer.id,
          store_id: store.id,
          total_price: 100.0,
          delivery_fee: 10.0,
          payment_status: "pending"
        })

      # Log in as customer
      {:ok, token, _} = MzingaDelivery.Auth.Guardian.encode_and_sign(customer)
      conn = put_req_header(conn, "authorization", "Bearer #{token}")

      conn = get(conn, ~p"/api/orders")
      data = json_response(conn, 200)["data"]
      assert Enum.any?(data, fn o -> o["id"] == order.id end)
    end

    test "vendor CANNOT see UNPAID orders in their store", %{
      conn: conn,
      customer: customer,
      vendor: vendor,
      store: store
    } do
      {:ok, order} =
        Orders.create_order(%{
          customer_id: customer.id,
          store_id: store.id,
          total_price: 100.0,
          delivery_fee: 10.0,
          payment_status: "pending"
        })

      # Log in as vendor
      {:ok, token, _} = MzingaDelivery.Auth.Guardian.encode_and_sign(vendor)
      conn = put_req_header(conn, "authorization", "Bearer #{token}")

      conn = get(conn, ~p"/api/orders")
      data = json_response(conn, 200)["data"]
      refute Enum.any?(data, fn o -> o["id"] == order.id end)
    end

    test "vendor CAN see PAID orders in their store", %{
      conn: conn,
      customer: customer,
      vendor: vendor,
      store: store
    } do
      {:ok, order} =
        Orders.create_order(%{
          customer_id: customer.id,
          store_id: store.id,
          total_price: 100.0,
          delivery_fee: 10.0,
          payment_status: "paid"
        })

      # Log in as vendor
      {:ok, token, _} = MzingaDelivery.Auth.Guardian.encode_and_sign(vendor)
      conn = put_req_header(conn, "authorization", "Bearer #{token}")

      conn = get(conn, ~p"/api/orders")
      data = json_response(conn, 200)["data"]
      assert Enum.any?(data, fn o -> o["id"] == order.id end)
    end
  end

  describe "Order Filter Visibility" do
    test "vendor filter ONLY shows PAID orders", %{
      conn: conn,
      customer: customer,
      vendor: vendor,
      store: store
    } do
      # Create one paid and one unpaid order
      {:ok, paid_order} =
        Orders.create_order(%{
          customer_id: customer.id,
          store_id: store.id,
          total_price: 150.0,
          delivery_fee: 10.0,
          payment_status: "paid"
        })

      {:ok, unpaid_order} =
        Orders.create_order(%{
          customer_id: customer.id,
          store_id: store.id,
          total_price: 50.0,
          delivery_fee: 10.0,
          payment_status: "pending"
        })

      # Log in as vendor
      {:ok, token, _} = MzingaDelivery.Auth.Guardian.encode_and_sign(vendor)
      conn = put_req_header(conn, "authorization", "Bearer #{token}")

      # Filter orders
      conn = get(conn, ~p"/api/orders/filter")
      data = json_response(conn, 200)["data"]

      assert Enum.any?(data, fn o -> o["id"] == paid_order.id end)
      refute Enum.any?(data, fn o -> o["id"] == unpaid_order.id end)
    end
  end
end
