defmodule MzingaDeliveryWeb.Auth.SetCurrentUser do
  import Plug.Conn
  alias MzingaDelivery.Auth.Guardian

  def init(opts), do: opts

  def call(conn, _opts) do
    case Guardian.Plug.current_resource(conn) do
      nil -> conn
      user -> assign(conn, :current_user, user)
    end
  end
end
