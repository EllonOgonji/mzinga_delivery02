defmodule MzingaDeliveryWeb.StoreController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  #only admin can create/update/delete stores
  plug :ensure_admin when action in [:create, :update, :delete]

  @doc """
  Lists all stores.(public)
  GET api/stores
  """
  def index(conn, _params) do
    stores = Stores.list_active_stores()
    render(conn, "index.json", stores: stores)
  end

  @doc """
  Get single store(public)
  GET api/stores/:id
  """
  def show(conn, %{"id" => id}) do
    case Stores.get_store!(id) do
      {:ok, store} ->
        render(conn, "show.json", store: store)

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})
    end
  end

  @doc """
  Create store(admin only)
  POST api/stores/:id
  """
  def create(conn, %{"store" => store_params}) do
    case Stores.create_store(store_params) do
      {:ok, store} ->
        conn
        |> put_status(:created)
        |> render("show.json", store: store)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  @doc """
  Update store(admin only)
  PATCH api/stores/:id
  """
def update(conn, %{"id" => id, "store" => store_params}) do
  with {:ok, store} <- Stores.get_store!(id),
       {:ok, updated_store} <- Stores.update_store(store, store_params) do
    render(conn, "show.json", store: updated_store)
  else
    {:error, :not_found} ->
      conn
      |> put_status(:not_found)
      |> json(%{error: "Store not found"})
    {:error, changeset} ->
      conn
      |> put_status(:unprocessable_entity)
      |> render("error.json", changeset: changeset)
  end
end

      @doc """
      Delete store(admin only)
      DELETE api/stores/:id
      """
def delete(conn, %{"id" => id}) do
  with {:ok, store} <- Stores.get_store!(id),
       {:ok, _store} <- Stores.delete_store(store) do
    send_resp(conn, :no_content, "")
  else
    {:error, :not_found} ->
      conn
      |> put_status(:not_found)
      |> json(%{error: "Store not found"})
  end
end

    #authorization helper
    defp ensure_admin(conn, _opts) do
      user = Guardian.Plug.current_resource(conn)

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
