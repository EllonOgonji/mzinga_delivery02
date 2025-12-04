defmodule MzingaDeliveryWeb.Vendor.StoreController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  plug :ensure_vendor

  @doc """
  List vendor's own stores
  GET /api/vendor/stores
  """
  def index(conn, _params) do
    vendor = Guardian.Plug.current_resource(conn)
    stores = Stores.list_vendor_stores(vendor.id)

    conn
    |> put_status(:ok)
    |> render(:index, stores: stores)
  end

  @doc """
  Create a new store
  POST /api/vendor/stores
  """
  def create(conn, %{"store" => store_params}) do
    vendor = Guardian.Plug.current_resource(conn)

    case Stores.create_vendor_store(vendor.id, store_params) do
      {:ok, store} ->
        conn
        |> put_status(:created)
        |> render(:show, store: store)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Get single vendor store
  GET /api/vendor/stores/:id
  """
  def show(conn, %{"id" => id}) do
    vendor = Guardian.Plug.current_resource(conn)

    case Stores.get_store(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      store ->
        if store.vendor_id == vendor.id do
          render(conn, :show, store: store)
        else
          conn
          |> put_status(:forbidden)
          |> json(%{error: "Not authorized to view this store"})
        end
    end
  end

  # Authorization
  defp ensure_vendor(conn, _opts) do
    user = Guardian.Plug.current_resource(conn)

    if user.role == "vendor" do
      conn
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Vendor access required"})
      |> halt()
    end
  end
end
