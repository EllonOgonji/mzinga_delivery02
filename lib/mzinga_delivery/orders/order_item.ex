defmodule MzingaDelivery.Orders.OrderItem do
  use Ecto.Schema
  import Ecto.Changeset

  schema "order_items" do
    field :quantity, :integer
    field :subtotal, :decimal

    belongs_to :order, MzingaDelivery.Orders.Order
    belongs_to :product, MzingaDelivery.Stores.Product

    timestamps()
  end

  @doc false
  def changeset(order_item, attrs) do
    order_item
    |> cast(attrs, [:order_id, :product_id, :quantity, :subtotal])
    |> validate_required([:order_id, :product_id, :quantity, :subtotal])
    |> validate_number(:quantity, greater_than: 0)
    |> validate_number(:subtotal, greater_than: 0)
    |> foreign_key_constraint(:order_id)
    |> foreign_key_constraint(:product_id)
  end
end
