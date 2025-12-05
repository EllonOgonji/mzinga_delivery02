defmodule MzingaDelivery.Stores.Store do
  use Ecto.Schema
  import Ecto.Changeset

  schema "stores" do
    field :name, :string
    field :address, :string
    field :latitude, :decimal
    field :longitude, :decimal
    field :status, :string, default: "Open"
    field :logo, :string
    field :banner, :string
    field :category, :string
    field :is_verified, :boolean, default: false
    field :rejection_reason, :string
    field :approved_at, :utc_datetime
    field :rejected_at, :utc_datetime

    belongs_to :vendor, MzingaDelivery.Accounts.User
    belongs_to :approved_by, MzingaDelivery.Accounts.User
    belongs_to :rejected_by, MzingaDelivery.Accounts.User
    has_many :products, MzingaDelivery.Stores.Product
    has_many :orders, MzingaDelivery.Orders.Order

    timestamps()
  end

  @valid_statuses ~w(pending approved rejected active inactive suspended)
  @valid_categories ["Liquor Store", "Wine Shop", "Beer Depot", "Spirits Outlet", "General"]

  @doc """
  Changeset for vendor creating a store.
  Status and is_verified are automatically set.
  """
  def vendor_create_changeset(store, attrs) do
    store
    |> cast(attrs, [:vendor_id, :name, :address, :latitude, :longitude, :logo, :banner, :category])
    |> validate_required([:vendor_id, :name, :address])
    |> validate_inclusion(:category, @valid_categories, allow_nil: true)
    |> put_change(:status, "pending")
    |> put_change(:is_verified, false)
    |> foreign_key_constraint(:vendor_id)
    |> unique_constraint(:name)
  end

  @doc """
  Admin changeset for general updates.
  """
  def admin_changeset(store, attrs) do
    store
    |> cast(attrs, [
      :vendor_id,
      :name,
      :address,
      :latitude,
      :longitude,
      :status,
      :logo,
      :banner,
      :category,
      :is_verified
    ])
    |> validate_required([:vendor_id, :name, :address])
    |> validate_inclusion(:status, @valid_statuses)
    |> validate_inclusion(:category, @valid_categories, allow_nil: true)
    |> foreign_key_constraint(:vendor_id)
    |> unique_constraint(:name)
  end

  @doc """
  Changeset for approving a store.
  """
  def approval_changeset(store, admin_id) do
    store
    |> change()
    |> put_change(:is_verified, true)
    |> put_change(:status, "approved")
    |> put_change(:approved_by_id, admin_id)
    |> put_change(:approved_at, DateTime.utc_now() |> DateTime.truncate(:second))
    |> put_change(:rejection_reason, nil)
    |> put_change(:rejected_at, nil)
    |> put_change(:rejected_by_id, nil)
  end

  @doc """
  Changeset for rejecting a store.
  """
  def rejection_changeset(store, admin_id, reason) do
    store
    |> change()
    |> put_change(:is_verified, false)
    |> put_change(:status, "rejected")
    |> put_change(:rejected_by_id, admin_id)
    |> put_change(:rejected_at, DateTime.utc_now() |> DateTime.truncate(:second))
    |> put_change(:rejection_reason, reason)
    |> put_change(:approved_at, nil)
    |> put_change(:approved_by_id, nil)
    |> validate_required([:rejection_reason])
  end

  @doc """
  Changeset for updating store verification status(admin only)
  """
  def verify_changeset(store, attrs) do
    store
    |> cast(attrs, [:is_verified])
    |> validate_required([:is_verified])
  end

  @doc """
  Changeset for verification - alias for verify_changeset
  """
  def verification_changeset(store, attrs) do
    verify_changeset(store, attrs)
  end
end
