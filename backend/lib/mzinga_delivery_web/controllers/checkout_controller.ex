defmodule MzingaDeliveryWeb.CheckoutController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Orders

  action_fallback MzingaDeliveryWeb.FallbackController

  def create(conn, params) do
    user = Guardian.Plug.current_resource(conn)

    case Orders.create_unified_checkout(user, params) do
      {:ok, result} ->
        conn
        |> put_status(:created)
        |> json(%{
          message: result.message,
          data: %{
            checkout_group_id: result.checkout_group_id,
            total_orders: length(result.orders),
            payment_status: "initiated"
          }
        })

      {:error, :empty_cart} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: "Cart is empty"})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: inspect(reason)})
    end
  end
end
