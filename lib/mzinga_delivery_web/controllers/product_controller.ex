defmodule MzingaDeliveryWeb.ProductController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Stores
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  plug :ensure_vendor_or_admin when action in [:create, :update, :delete]

  @doc """
  List products for a store (public)
  GET /api/stores/:store_id/products
  """
  def index(conn, %{"store_id" => store_id}) do
    products = Stores.list_products_by_store(store_id)
    render(conn, "index.json", products: products)
  end

  @doc """
  Get single product (public)
  GET /api/products/:id
  """
  def show(conn, %{"id" => id}) do
    case Stores.get_product!(id) do
      {:ok, product} ->
        render(conn, "show.json", product: product)

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Product not found"})
    end
  end

  @doc """
  Create product (vendor only - for their own store)
  POST /api/products
  """
  def create(conn, %{"product" => product_params}) do
    case Stores.create_product(product_params) do
      {:ok, product} ->
        conn
        |> put_status(:created)
        |> render("show.json", product: product)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", changeset: changeset)
    end
  end

  @doc """
  Update product (vendor only)
  PATCH /api/products/:id
  """
  def update(conn, %{"id" => id, "product" => product_params}) do
    with {:ok, product} <- Stores.get_product!(id),
         {:ok, updated_product} <- Stores.update_product(product, product_params) do
      render(conn, "show.json", product: updated_product)
    end
  end

  @doc """
  Delete product (vendor only)
  DELETE /api/products/:id
  """
  def delete(conn, %{"id" => id}) do
    with {:ok, product} <- Stores.get_product!(id),
         {:ok, _product} <- Stores.delete_product(product) do
      send_resp(conn, :no_content, "")
    end
  end

  # Authorization: vendor must own the store OR be admin
  defp ensure_vendor_or_admin(conn, _opts) do
    user = Guardian.Plug.current_resource(conn)

    cond do
      user.role == "admin" ->
        conn

      user.role == "vendor" ->
        # For create: check store_id in params
        # For update/delete: check product's store ownership
        store_id = get_store_id_from_params(conn)

        case Stores.get_store(store_id) do
          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Store not found"})
            |> halt()

          store ->
            if store.vendor_id == user.id do
              conn
            else
              conn
              |> put_status(:forbidden)
              |> json(%{error: "You can only manage products in your own store"})
              |> halt()
            end
        end

      true ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Vendor or admin access required"})
        |> halt()
    end
  end

  defp get_store_id_from_params(conn) do
    case conn.params do
      %{"product" => %{"store_id" => store_id}} -> store_id
      %{"id" => product_id} ->
        case Stores.get_product(product_id) do
          nil -> nil
          product -> product.store_id
        end
      _ -> nil
    end
  end
end
