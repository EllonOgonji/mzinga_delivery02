defmodule MzingaDeliveryWeb.CartController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Carts
  alias MzingaDeliveryWeb.FallbackController

  action_fallback(FallbackController)

  def show(conn, _params) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)
    cart = Carts.get_cart(user.id)
    render(conn, :show, cart: cart)
  end

  def add_item(conn, %{"product_id" => product_id, "quantity" => quantity}) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)

    case Carts.add_item(user.id, product_id, quantity) do
      {:ok, _item} ->
        # Reload full cart to show updated total
        cart = Carts.get_cart(user.id)

        conn
        |> put_status(:created)
        |> render(:show, cart: cart)

      {:error, :different_store} ->
        conn
        |> put_status(:conflict)
        |> json(%{
          error: "Cart contains items from another store",
          code: "DIFFERENT_STORE",
          message: "Would you like to clear your cart and start a new order?"
        })

      {:error, :out_of_stock} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          error: "Product is out of stock",
          code: "OUT_OF_STOCK"
        })

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: inspect(reason)})
    end
  end

  def remove_item(conn, %{"product_id" => product_id}) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)
    Carts.remove_item(user.id, product_id)
    cart = Carts.get_cart(user.id)
    render(conn, :show, cart: cart)
  end

  def delete(conn, _params) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)
    Carts.clear_cart(user.id)
    send_resp(conn, :no_content, "")
  end
end
