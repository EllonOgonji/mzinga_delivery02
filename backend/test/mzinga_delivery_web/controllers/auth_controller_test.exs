defmodule MzingaDeliveryWeb.AuthControllerTest do
  use MzingaDeliveryWeb.ConnCase

  alias MzingaDelivery.Accounts

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "register user" do
    test "renders user when data is valid", %{conn: conn} do
      user_params = %{
        "full_name" => "John Doe",
        "email" => "john@example.com",
        "phone_number" => "254700000000",
        "password" => "secret123",
        "password_confirmation" => "secret123",
        "role" => "customer"
      }

      conn = post(conn, ~p"/api/auth/register", user: user_params)
      assert %{"data" => %{"token" => _token, "user" => user_json}} = json_response(conn, 201)
      assert user_json["email"] == "john@example.com"
      assert user_json["full_name"] == "John Doe"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/auth/register", user: %{"email" => "invalid"})
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "login user" do
    setup do
      {:ok, user} =
        Accounts.create_user(%{
          full_name: "Jane Doe",
          email: "jane@example.com",
          phone_number: "254711111111",
          password: "password123",
          password_confirmation: "password123",
          role: "customer"
        })

      %{user: user}
    end

    test "renders token when credentials are valid", %{conn: conn, user: user} do
      conn = post(conn, ~p"/api/auth/login", email: user.email, password: "password123")
      assert %{"data" => %{"token" => _token, "user" => _user_json}} = json_response(conn, 200)
    end

    test "renders unauthorized when password is wrong", %{conn: conn, user: user} do
      conn = post(conn, ~p"/api/auth/login", email: user.email, password: "wrongpassword")
      assert json_response(conn, 401)["error"] == "Invalid email or password"
    end
  end
end
