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

    belongs_to :vendor, MzingaDelivery.Accounts.User
    has_many :products, MzingaDelivery.Stores.Product
    has_many :orders, MzingaDelivery.Orders.Order

    timestamps()
  end

  @doc false
  def changeset(store, attrs) do
    store
    |> cast(attrs, [:vendor_id, :name, :address, :latitude, :longitude, :status])
    |> validate_required([:vendor_id, :name, :address])
    |> validate_inclusion(:status, ["Open", "Closed", "suspended"])
    |> validate_inclusion(:category, [
      "Liquor Store",
      "Wine Shop",
      "Beer Depot",
      "Spirit Outlet",
      "General"
    ])
    |> foreign_key_constraint(:vendor_id)
    |> unique_constraint(:name)
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
