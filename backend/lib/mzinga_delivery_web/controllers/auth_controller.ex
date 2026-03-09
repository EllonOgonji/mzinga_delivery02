defmodule MzingaDeliveryWeb.AuthController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  Register a new user
  POST /api/auth/register
  Accepts payload in two shapes:
    - {"user": {...user fields...}}
    - {...user fields...}
  """
  def register(conn, params) do
    # Accept both wrapped ({"user": {...}}) and unwrapped ({...}) payloads
    user_params = params["user"] || params

    case Accounts.create_user(user_params) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> render(:auth, user: user, token: token)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Login existing user
  POST /api/auth/login
  """
  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:ok)
        |> render(:auth, user: user, token: token)

      {:error, :unauthorized} ->
        conn
        |> put_status(:unauthorized)
        |> render(:error, message: "Invalid email or password")
    end
  end

  @doc """
  Get current user profile
  GET /api/auth/me
  """
  def me(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render(:user, user: user)
  end

  @doc """
  Update current user profile
  PUT /api/auth/me
  """
  def update_profile(conn, params) do
    user = Guardian.Plug.current_resource(conn)
    user_params = params["user"] || params

    case Accounts.update_user(user, user_params) do
      {:ok, updated_user} ->
        conn
        |> put_status(:ok)
        |> render(:user, user: updated_user)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Logout user (client should delete token)
  POST /api/auth/logout
  """
  def logout(conn, _params) do
    conn
    |> Guardian.Plug.sign_out()
    |> put_status(:ok)
    |> json(%{message: "Logged out successfully"})
  end

  @doc """
  Initiate forgot password flow
  POST /api/auth/forgot_password
  """
  def forgot_password(conn, %{"email" => email}) do
    if user = Accounts.get_user_by_email(email) do
      {:ok, updated_user} = Accounts.generate_reset_password_token(user)

      case MzingaDelivery.Accounts.UserNotifier.send_password_reset_instructions(updated_user) do
        {:ok, _} ->
          :ok

        {:error, reason} ->
          require Logger
          Logger.error("Failed to send password reset email: #{inspect(reason)}")
      end
    end

    # Always return success to prevent email enumeration
    conn
    |> put_status(:ok)
    |> json(%{
      message: "If your email is in our system, you will receive reset instructions shortly."
    })
  end

  @doc """
  Reset password
  POST /api/auth/reset_password
  """
  def reset_password(conn, %{
        "token" => token,
        "password" => password,
        "password_confirmation" => password_confirmation
      }) do
    if user = Accounts.get_user_by_reset_password_token(token) do
      case Accounts.reset_user_password(user, %{
             password: password,
             password_confirmation: password_confirmation
           }) do
        {:ok, _user} ->
          conn
          |> put_status(:ok)
          |> json(%{message: "Password reset successfully"})

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(:error, changeset: changeset)
      end
    else
      conn
      |> put_status(:unprocessable_entity)
      |> json(%{errors: %{detail: "Invalid or expired reset token"}})
    end
  end
end
