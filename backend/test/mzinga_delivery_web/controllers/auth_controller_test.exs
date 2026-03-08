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

  describe "forgot_password/2" do
    test "returns success and generates token for valid email", %{user: user} do
      conn = build_conn()
      conn = post(conn, ~p"/api/auth/forgot_password", %{"email" => user.email})

      assert json_response(conn, 200)["message"] ==
               "If your email is in our system, you will receive reset instructions shortly."

      updated_user = Accounts.get_user_by_email(user.email)
      assert updated_user.reset_password_token != nil
      assert updated_user.reset_password_sent_at != nil
    end

    test "returns success even for invalid email to prevent enumeration" do
      conn = build_conn()
      conn = post(conn, ~p"/api/auth/forgot_password", %{"email" => "nonexistent@example.com"})

      assert json_response(conn, 200)["message"] ==
               "If your email is in our system, you will receive reset instructions shortly."
    end
  end

  describe "reset_password/2" do
    test "resets password with valid token", %{user: user} do
      {:ok, user_with_token} = Accounts.generate_reset_password_token(user)

      conn = build_conn()

      conn =
        post(conn, ~p"/api/auth/reset_password", %{
          "token" => user_with_token.reset_password_token,
          "password" => "newpassword123",
          "password_confirmation" => "newpassword123"
        })

      assert json_response(conn, 200)["message"] == "Password reset successfully"

      updated_user = Accounts.get_user_by_email(user.email)
      assert updated_user.reset_password_token == nil
      assert updated_user.reset_password_sent_at == nil
      assert Bcrypt.verify_pass("newpassword123", updated_user.password_hash)
    end

    test "fails with invalid token" do
      conn = build_conn()

      conn =
        post(conn, ~p"/api/auth/reset_password", %{
          "token" => "invalid-token",
          "password" => "newpassword123",
          "password_confirmation" => "newpassword123"
        })

      assert json_response(conn, 422)["errors"]["detail"] == "Invalid or expired reset token"
    end
  end
end
