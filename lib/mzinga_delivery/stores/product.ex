defmodule MzingaDelivery.Stores.Product do
  use Ecto.Schema
  import Ecto.Changeset

  schema "products" do
    field :name, :string
    field :description, :string
    field :price, :decimal
    field :stock, :integer
    field :image_url, :string
    field :category, :string

    belongs_to :store, MzingaDelivery.Stores.Store
    has_many :order_items, MzingaDelivery.Orders.OrderItem

    timestamps()
  end

  @doc false
  def changeset(product, attrs) do
    product
    |> cast(attrs, [:store_id, :name, :description, :price, :stock, :image_url, :category])
    |> validate_required([:store_id, :name, :price, :stock])
    |> validate_number(:price, greater_than: 0)
    |> validate_number(:stock, greater_than_or_equal_to: 0)
    |> foreign_key_constraint(:store_id)
  end
end
