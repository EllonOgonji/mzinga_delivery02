defmodule MzingaDeliveryWeb.WishlistController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Accounts
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    wishlist_items = Accounts.list_wishlist_items(user.id)
    render(conn, "index.json", wishlist_items: wishlist_items)
  end

  def create(conn, %{"product_id" => product_id}) do
    user = Guardian.Plug.current_resource(conn)

    case Accounts.add_to_wishlist(user.id, product_id) do
      {:ok, wishlist_item} ->
        # Preload for rendering
        wishlist_item = MzingaDelivery.Repo.preload(wishlist_item, product: :store)

        conn
        |> put_status(:created)
        |> render("show.json", wishlist_item: wishlist_item)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"product_id" => product_id}) do
    user = Guardian.Plug.current_resource(conn)

    case Accounts.remove_from_wishlist(user.id, product_id) do
      {:ok, :deleted} ->
        send_resp(conn, :no_content, "")

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Item not found in wishlist"})
    end
  end
end
