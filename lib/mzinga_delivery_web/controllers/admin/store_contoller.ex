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
