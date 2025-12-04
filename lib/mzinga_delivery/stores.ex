defmodule MzingaDelivery.Stores do
  @moduledoc """
  The Stores context - manages stores and products.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.{Store, Product}
  alias MzingaDelivery.Stores.Filters
  alias MzingaDelivery.Stores.StoreFilters

  # STORES

  @doc """
  Returns the list of stores.
  """
  def list_stores do
    Store
    |> preload(:vendor)
    |> Repo.all()
  end

  @doc """
  Returns the list of active stores.
  """
  def list_active_stores do
    Store
    |> where([s], s.status == "Open")
    |> preload(:vendor)
    |> Repo.all()
  end

  @doc """
  Gets a single store.
  """
  def get_store(id) do
    Store
    |> preload(:vendor)
    |> Repo.get(id)
  end

  @doc """
  Gets a single store with error tuple.
  """
  def get_store!(id) do
    case get_store(id) do
      nil -> {:error, :not_found}
      store -> {:ok, store}
    end
  end

  @doc """
  Gets stores owned by a vendor.
  """
  def get_stores_by_vendor(vendor_id) do
    Store
    |> where([s], s.vendor_id == ^vendor_id)
    |> Repo.all()
  end

  @doc """
  Creates a store (admin only).
  """
  def create_store(attrs \\ %{}) do
    %Store{}
    |> Store.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a store.
  """
  def update_store(%Store{} = store, attrs) do
    store
    |> Store.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a store.
  """
  def delete_store(%Store{} = store) do
    Repo.delete(store)
  end

  # PRODUCTS

  @doc """
  Returns the list of products for a store.
  """
  def list_products_by_store(store_id) do
    Product
    |> where([p], p.store_id == ^store_id)
    |> Repo.all()
  end

  @doc """
  Gets a single product.
  """
  def get_product(id) do
    Product
    |> preload(:store)
    |> Repo.get(id)
  end

  @doc """
  Gets a single product with error tuple.
  """
  def get_product!(id) do
    case get_product(id) do
      nil -> {:error, :not_found}
      product -> {:ok, product}
    end
  end

  @doc """
  Creates a product.
  """
  def create_product(attrs \\ %{}) do
    %Product{}
    |> Product.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a product.
  """
  def update_product(%Product{} = product, attrs) do
    product
    |> Product.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a product.
  """
  def delete_product(%Product{} = product) do
    Repo.delete(product)
  end

  @doc """
  Reduces product stock after order.
  """
  def reduce_product_stock(product_id, quantity) do
    product = Repo.get(Product, product_id)

    if product && product.stock >= quantity do
      update_product(product, %{stock: product.stock - quantity})
    else
      {:error, :insufficient_stock}
    end
  end

  @doc """
  Filters products based on provided parameters.
  """
  def filter_products(params \\ %{}) do
    Filters.filter_products(params)
  end

  @doc """
  Count total products matching filters.
  """
  def count_filtered_products(params \\ %{}) do
    Filters.count_filtered_products(params)
  end

  # STORE FILTERING
  @doc """
  Filters stores based on provided parameters.
  """
  def filter_stores(params \\ %{}) do
    StoreFilters.filter_stores(params)
  end

  @doc """
  Count total stores matching filters.
  """
  def count_filtered_stores(params \\ %{}) do
    StoreFilters.count_filtered_stores(params)
  end

  @doc """
  Get all unique categories from products.
  """
  def list_categories do
    Product
    |> select([p], p.category)
    |> distinct(true)
    |> where([p], not is_nil(p.category))
    |> order_by([p], asc: p.category)
    |> Repo.all()
  end

  @doc """
  Get price range (min and max) from all products.
  """
  def get_price_range do
    Product
    |> select([p], %{
      min_price: min(p.price),
      max_price: max(p.price)
    })
    |> Repo.one()
  end

  @doc """
  Returns List of verified stores only.
  """
  def list_verified_stores do
    Store
    |> where([s], s.is_verified == true and s.status == "Open")
    |> preload(:vendor)
    |> Repo.all()
  end

  @doc """
  Verifies a store (admin only).
  """
  def verify_store(%Store{} = store) do
    store
    |> Store.verify_changeset(%{is_verified: true})
    |> Repo.update()
  end

  @doc """
  Unverify Store (admin only).
  """
  def unverify_store(%Store{} = store) do
    store
    |> Store.verify_changeset(%{is_verified: false})
    |> Repo.update()
  end

  @doc """
  Toggle store verification status.
  """
  def toggle_verification(%Store{} = store) do
    store
    |> Store.verification_changeset(%{is_verified: !store.is_verified})
    |> Repo.update()
  end
end
