defmodule MzingaDeliveryWeb.Vendor.StoreControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian
  alias MzingaDelivery.Stores

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

  describe "update store" do
    setup %{conn: conn, user: user} do
      {:ok, store} =
        Stores.create_vendor_store(user.id, %{
          "name" => "Old Store Name",
          "address" => "123 Old St"
        })

      %{store: store}
    end

    test "updates store and renders when data is valid", %{conn: conn, store: store} do
      update_params = %{
        name: "New Store Name",
        logo: "http://example.com/new_logo.png",
        banner: "http://example.com/new_banner.png"
      }

      conn = patch(conn, ~p"/api/vendor/stores/#{store.id}", store: update_params)
      response = json_response(conn, 200)["data"]

      assert response["name"] == "New Store Name"
      assert response["id"] == store.id
      # status should not have changed
      assert Stores.get_store!(store.id).status == "pending"
    end

    test "ignores status and is_verified fields when a vendor updates", %{
      conn: conn,
      store: store
    } do
      update_params = %{
        name: "Hacked Store",
        status: "approved",
        is_verified: true
      }

      conn = patch(conn, ~p"/api/vendor/stores/#{store.id}", store: update_params)
      response = json_response(conn, 200)["data"]

      assert response["name"] == "Hacked Store"
      db_store = Stores.get_store!(store.id)
      # These fields must remain as their defaults since vendor_update_changeset doesn't cast them
      assert db_store.status == "pending"
      assert db_store.is_verified == false
    end

    test "cannot update someone else's store", %{user: _user} do
      {:ok, user2} =
        Accounts.create_user(%{
          full_name: "Vendor Two",
          email: "vendortwo@example.com",
          phone_number: "254700000001",
          password: "password123",
          password_confirmation: "password123",
          role: "vendor"
        })

      # Create store for user 2
      {:ok, store2} =
        Stores.create_vendor_store(user2.id, %{
          "name" => "Vendor Two Store",
          "address" => "456 Other St"
        })

      # Using the conn setup for Vendor One
      {:ok, user1} =
        Accounts.create_user(%{
          full_name: "Vendor One",
          email: "vendorone@example.com",
          phone_number: "254700000000",
          password: "password123",
          password_confirmation: "password123",
          role: "vendor"
        })

      {:ok, token, _} = Guardian.encode_and_sign(user1)
      conn = put_req_header(build_conn(), "authorization", "Bearer #{token}")

      conn = patch(conn, ~p"/api/vendor/stores/#{store2.id}", store: %{name: "Stolen Name"})

      # Should be forbidden
      assert json_response(conn, 403)["error"] == "Not authorized to update this store"
    end
  end
end
