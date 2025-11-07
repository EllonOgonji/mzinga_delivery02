defmodule MzingaDeliveryWeb.AuthController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  register a new user
  POST /api/auth/register
  """
  def register(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> render("auth.json", %{user: user, token: token})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  @doc """
  login existing user
  POST /api/auth/login
  """
  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:ok)
        |> render("auth.json", %{user: user, token: token})

      {:error, :unauthorized} ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json", %{error: "Invalid email or password"})
    end
  end

  @doc """
  get current user profile
  GET /api/auth/me
  """
  def me(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("user.json", %{user: user})
  end

  @doc """
  logout user
  POST /api/auth/logout
  """
  def logout(conn, _params) do
    conn
    |> Guardian.Plug.sign_out()
    |> put_status(:ok)
    |> json(%{message: "Logged out successfully"})
  end
end
