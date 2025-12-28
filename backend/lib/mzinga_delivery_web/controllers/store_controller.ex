defmodule MzingaDeliveryWeb.StoreController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores

  action_fallback MzingaDeliveryWeb.FallbackController

  @doc """
  List all approved public stores
  GET /api/stores
  """
  def index(conn, _params) do
    stores = Stores.list_public_stores()
    render(conn, :index, stores: stores)
  end

  @doc """
  Get single approved store
  GET /api/stores/:id
  """
  def show(conn, %{"id" => id}) do
    case Stores.get_public_store(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      store ->
        render(conn, :show, store: store)
    end
  end
end
