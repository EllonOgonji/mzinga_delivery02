defmodule MzingaDeliveryWeb.Admin.DashboardController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Orders

  action_fallback MzingaDeliveryWeb.FallbackController

  plug :ensure_admin

  @doc """
  Get all dashboard stats for the admin.
  GET /api/admin/dashboard/stats
  Supports `?timeframe=day|week|month|year|all` for total_order_value calculation.
  Defaults to all.
  """
  def stats(conn, params) do
    timeframe =
      case params["timeframe"] do
        "day" -> :day
        "week" -> :week
        "month" -> :month
        "year" -> :year
        _ -> :all
      end

    unverified_shops = Stores.count_unverified_stores()
    verified_shops = Stores.count_verified_stores()
    total_order_value = Orders.get_total_successful_order_value(timeframe)

    conn
    |> put_status(:ok)
    |> json(%{
      data: %{
        unverified_shops: unverified_shops,
        verified_shops: verified_shops,
        total_order_value: total_order_value,
        timeframe: timeframe
      }
    })
  end

  # Authorization
  defp ensure_admin(conn, _opts) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)

    if user && user.role == "admin" do
      conn
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Admin access required"})
      |> halt()
    end
  end
end
