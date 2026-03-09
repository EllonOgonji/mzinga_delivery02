defmodule MzingaDeliveryWeb.Admin.StoreController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  plug :ensure_admin

  @doc """
  List all pending stores
  GET /api/admin/stores/pending
  """
  def pending(conn, _params) do
    stores = Stores.list_pending_stores()

    conn
    |> put_status(:ok)
    |> render(:index, stores: stores)
  end

  @doc """
  Filter and paginate stores for admin (unrestricted)
  GET /api/admin/stores/filter
  """
  def filter(conn, params) do
    stores = Stores.filter_admin_stores(params)
    total = Stores.count_filtered_admin_stores(params)

    conn
    |> put_status(:ok)
    |> json(%{
      data: Enum.map(stores, &build_store_json/1),
      meta: build_meta(params, stores, total)
    })
  end

  defp build_store_json(store) do
    %{
      id: store.id,
      name: store.name,
      status: store.status,
      category: store.category,
      logo: store.logo,
      banner: store.banner,
      is_verified: store.is_verified,
      inserted_at: store.inserted_at,
      vendor: %{
        id: store.vendor.id,
        name: store.vendor.full_name,
        email: store.vendor.email
      }
    }
  end

  defp build_meta(params, stores, total) do
    limit = parse_int(params["limit"], 50)
    offset = parse_int(params["offset"], 0)

    %{
      total: total,
      count: length(stores),
      limit: limit,
      offset: offset,
      has_more: offset + length(stores) < total
    }
  end

  defp parse_int(nil, d), do: d

  defp parse_int(val, d) when is_binary(val) do
    case Integer.parse(val) do
      {x, _} -> x
      _ -> d
    end
  end

  defp parse_int(val, _), do: val

  @doc """
  Create a new store (admin)
  POST /api/admin/stores
  """
  def create(conn, %{"store" => store_params}) do
    case Stores.create_store(store_params) do
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
  Update a store (admin)
  PATCH /api/admin/stores/:id
  """
  def update(conn, %{"id" => id, "store" => store_params}) do
    with store when not is_nil(store) <- Stores.get_store(id),
         {:ok, updated_store} <- Stores.update_store(store, store_params) do
      render(conn, :show, store: updated_store)
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Delete a store (admin)
  DELETE /api/admin/stores/:id
  """
  def delete(conn, %{"id" => id}) do
    with store when not is_nil(store) <- Stores.get_store(id),
         {:ok, _store} <- Stores.delete_store(store) do
      send_resp(conn, :no_content, "")
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})
    end
  end

  @doc """
  Approve a store
  PATCH /api/admin/stores/:id/approve
  """
  def approve(conn, %{"id" => id}) do
    admin = Guardian.Plug.current_resource(conn)

    with store when not is_nil(store) <- Stores.get_store(id),
         {:ok, approved_store} <- Stores.approve_store(store, admin.id) do
      conn
      |> put_status(:ok)
      |> render(:show, store: approved_store)
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Reject a store
  PATCH /api/admin/stores/:id/reject
  Body: { "reason": "Store does not meet requirements" }
  """
  def reject(conn, %{"id" => id, "reason" => reason}) do
    admin = Guardian.Plug.current_resource(conn)

    with store when not is_nil(store) <- Stores.get_store(id),
         {:ok, rejected_store} <- Stores.reject_store(store, admin.id, reason) do
      conn
      |> put_status(:ok)
      |> render(:show, store: rejected_store)
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Store not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  # Rejection reason validation helper
  def reject(conn, %{"id" => _id}) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Rejection reason is required"})
  end

  # Authorization
  defp ensure_admin(conn, _opts) do
    user = Guardian.Plug.current_resource(conn)

    if user.role == "admin" do
      conn
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Admin access required"})
      |> halt()
    end
  end
end
