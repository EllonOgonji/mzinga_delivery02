defmodule MzingaDelivery.Stores do
  @moduledoc """
  The Stores context - manages stores and products with approval workflow.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.{Store, Product}
  alias MzingaDelivery.Stores.Filters
  alias MzingaDelivery.Stores.StoreFilters
  alias MzingaDelivery.Notifications

  # Stores

  def list_stores do
    Store
    |> preload([:vendor, :approved_by, :rejected_by])
    |> Repo.all()
  end

  def list_active_stores do
    Store
    |> where([s], s.status == "Open")
    |> preload(:vendor)
    |> Repo.all()
  end

  def get_store(id) do
    Store
    |> preload([:vendor, :approved_by, :rejected_by])
    |> Repo.get(id)
  end

  def get_store!(id) do
    case get_store(id) do
      nil -> {:error, :not_found}
      store -> {:ok, store}
    end
  end

  def get_stores_by_vendor(vendor_id) do
    Store
    |> where([s], s.vendor_id == ^vendor_id)
    |> preload([:vendor, :approved_by, :rejected_by])
    |> Repo.all()
  end

  def create_store(attrs \\ %{}) do
    %Store{}
    |> Store.admin_changeset(attrs)
    |> Repo.insert()
  end

  def update_store(%Store{} = store, attrs) do
    store
    |> Store.admin_changeset(attrs)
    |> Repo.update()
  end

  def delete_store(%Store{} = store) do
    Repo.delete(store)
  end

  # vendor store management

  def create_vendor_store(vendor_id, attrs) do
    attrs = Map.put(attrs, "vendor_id", vendor_id)

    %Store{}
    |> Store.vendor_create_changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, store} ->
        {:ok, Repo.preload(store, [:vendor, :approved_by, :rejected_by])}

      error ->
        error
    end
  end

  def list_vendor_stores(vendor_id) do
    Store
    |> where([s], s.vendor_id == ^vendor_id)
    |> order_by([s], desc: s.inserted_at)
    |> preload([:vendor, :approved_by, :rejected_by])
    |> Repo.all()
  end

  # admin store approval management
  def list_pending_stores do
    Store
    |> where([s], s.status == "pending")
    |> preload([:vendor, :approved_by, :rejected_by])
    |> order_by(asc: :inserted_at)
    |> Repo.all()
  end

  def approve_store(%Store{} = store, admin_id) do
    Repo.transaction(fn ->
      case Repo.update(Store.approval_changeset(store, admin_id)) do
        {:ok, approved_store} ->
          Notifications.create_notification(%{
            user_id: store.vendor_id,
            message: "Your store '#{store.name}' has been approved.",
            type: "store_approved"
          })

          approved_store

        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end

  def reject_store(%Store{} = store, admin_id, reason) do
    Repo.transaction(fn ->
      case Repo.update(Store.rejection_changeset(store, admin_id, reason)) do
        {:ok, rejected_store} ->
          Notifications.create_notification(%{
            user_id: store.vendor_id,
            message: "Your store '#{store.name}' was rejected. Reason: #{reason}",
            type: "store_rejected"
          })

          rejected_store

        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end

  # public stores (approved and verified)

  def list_public_stores do
    Store
    |> where([s], s.status == "approved" and s.is_verified == true)
    |> preload(:vendor)
    |> order_by([s], desc: s.approved_at)
    |> Repo.all()
  end

  def count_verified_stores do
    Store
    |> where([s], s.status == "approved" and s.is_verified == true)
    |> Repo.aggregate(:count, :id)
  end

  def count_unverified_stores do
    Store
    |> where([s], s.is_verified == false or s.status != "approved")
    |> Repo.aggregate(:count, :id)
  end

  def get_public_store(id) do
    Store
    |> where([s], s.id == ^id and s.status == "approved" and s.is_verified == true)
    |> preload(:vendor)
    |> Repo.one()
  end

  def list_verified_stores do
    Store
    |> where([s], s.status == "approved" and s.is_verified == true)
    |> preload(:vendor)
    |> Repo.all()
  end

  # verification management

  def verify_store(%Store{} = store) do
    store
    |> Store.verification_changeset(%{is_verified: true})
    |> Repo.update()
  end

  def unverify_store(%Store{} = store) do
    store
    |> Store.verification_changeset(%{is_verified: false})
    |> Repo.update()
  end

  def toggle_verification(%Store{} = store) do
    store
    |> Store.verification_changeset(%{is_verified: !store.is_verified})
    |> Repo.update()
  end

  # product management

  def list_products_by_store(store_id) do
    Product
    |> where([p], p.store_id == ^store_id)
    |> preload(:store)
    |> Repo.all()
  end

  def list_available_products do
    Product
    |> where([p], p.available == true)
    |> preload(:store)
    |> Repo.all()
  end

  def get_product(id) do
    Product
    |> preload(:store)
    |> Repo.get(id)
  end

  def get_product!(id) do
    case get_product(id) do
      nil -> {:error, :not_found}
      product -> {:ok, product}
    end
  end

  def create_product(attrs \\ %{}) do
    %Product{}
    |> Product.changeset(attrs)
    |> Repo.insert()
  end

  def update_product(%Product{} = product, attrs) do
    product
    |> Product.changeset(attrs)
    |> Repo.update()
  end

  def delete_product(%Product{} = product) do
    Repo.delete(product)
  end

  def reduce_product_stock(product_id, quantity) do
    product = Repo.get(Product, product_id)

    if product && product.stock >= quantity do
      update_product(product, %{stock: product.stock - quantity})
    else
      {:error, :insufficient_stock}
    end
  end

  # product filters

  def filter_products(params \\ %{}), do: Filters.filter_products(params)
  def count_filtered_products(params \\ %{}), do: Filters.count_filtered_products(params)

  def filter_stores(params \\ %{}), do: StoreFilters.filter_stores(params)
  def count_filtered_stores(params \\ %{}), do: StoreFilters.count_filtered_stores(params)

  def filter_admin_stores(params \\ %{}), do: StoreFilters.filter_admin_stores(params)

  def count_filtered_admin_stores(params \\ %{}),
    do: StoreFilters.count_filtered_admin_stores(params)

  def list_categories do
    Product
    |> select([p], p.category)
    |> distinct(true)
    |> where([p], not is_nil(p.category))
    |> order_by(asc: :category)
    |> Repo.all()
  end

  def get_price_range do
    Product
    |> select([p], %{min_price: min(p.price), max_price: max(p.price)})
    |> Repo.one()
  end

  def list_store_categories do
    Store
    |> select([s], s.category)
    |> distinct(true)
    |> where([s], not is_nil(s.category))
    |> order_by(asc: :category)
    |> Repo.all()
  end
end
