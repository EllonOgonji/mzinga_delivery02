defmodule MzingaDeliveryWeb.AuthControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  setup %{conn: conn} do
    {:ok, user} =
      Accounts.create_user(%{
        "full_name" => "Original Name",
        "email" => "testuser@example.com",
        "phone_number" => "254700000010",
        "password" => "password123",
        "password_confirmation" => "password123",
        "role" => "customer"
      })

    {:ok, token, _claims} = Guardian.encode_and_sign(user)
    conn = put_req_header(conn, "authorization", "Bearer #{token}")

    %{conn: conn, user: user}
  end

  describe "update_profile/2" do
    test "successfully updates user profile with valid data", %{conn: conn} do
      update_params = %{
        "user" => %{
          "full_name" => "Updated Name",
          "phone_number" => "254799999999",
          "avatar_url" => "https://example.com/new_avatar.png"
        }
      }

      conn = put(conn, ~p"/api/auth/me", update_params)
      response = json_response(conn, 200)["data"]

      assert response["full_name"] == "Updated Name"
      assert response["phone_number"] == "254799999999"
      assert response["avatar_url"] == "https://example.com/new_avatar.png"
      # Ensure email wasn't changed
      assert response["email"] == "testuser@example.com"
    end

    test "fails to update profile with invalid email", %{conn: conn} do
      update_params = %{
        "user" => %{
          "email" => "invalid-email"
        }
      }

      conn = put(conn, ~p"/api/auth/me", update_params)
      response = json_response(conn, 422)["errors"]

      assert response["email"] != nil
    end

    test "fails to update profile when unauthenticated" do
      conn = build_conn()

      update_params = %{
        "user" => %{
          "full_name" => "Hacker"
        }
      }

      conn = put(conn, ~p"/api/auth/me", update_params)
      assert json_response(conn, 401)
    end
  end
end
