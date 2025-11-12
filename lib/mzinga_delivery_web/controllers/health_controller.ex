defmodule MzingaDeliveryWeb.HealthController do
  use MzingaDeliveryWeb, :controller

  def index(conn, _params) do
    json(conn, %{status: "ok", message: "Mzinga Delivery API is live!"})
  end
end
