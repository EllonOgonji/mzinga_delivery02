defmodule MzingaDeliveryWeb.UserSocket do
  use Phoenix.Socket

  require Logger

  # Channel routes
  channel "notifications:*", MzingaDeliveryWeb.NotificationChannel

  @doc """
  Connect to socket with JWT authentication.
  Client must send token in connection params.
  """
  def connect(%{"token" => token}, socket, _connect_info) do
    Logger.info("WebSocket connection attempt with token")

    case MzingaDelivery.Auth.Guardian.decode_and_verify(token) do
      {:ok, claims} ->
        Logger.info("Token verified, loading user from claims")

        case MzingaDelivery.Auth.Guardian.resource_from_claims(claims) do
          {:ok, user} ->
            Logger.info("User #{user.id} (#{user.role}) connected via WebSocket")
            {:ok, assign(socket, :current_user, user)}

          {:error, reason} ->
            Logger.error("Failed to load user from claims: #{inspect(reason)}")
            :error
        end

      {:error, reason} ->
        Logger.error("Token verification failed: #{inspect(reason)}")
        :error
    end
  end

  def connect(_params, _socket, _connect_info) do
    Logger.warning("WebSocket connection attempt without token")
    :error
  end

  @doc """
  Socket ID for presence tracking (optional).
  """
  def id(socket), do: "user_socket:#{socket.assigns.current_user.id}"
end
