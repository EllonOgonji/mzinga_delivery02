defmodule MzingaDelivery.Carts.CartItem do
  use Ecto.Schema
  import Ecto.Changeset

  schema "cart_items" do
    field :quantity, :integer
    field :unit_price, :decimal
    field :subtotal, :decimal
    belongs_to :cart, MzingaDelivery.Carts.Cart
    belongs_to :product, MzingaDelivery.Stores.Product

    timestamps()
  end

  @doc false
  def changeset(cart_item, attrs) do
    cart_item
    |> cast(attrs, [:cart_id, :product_id, :quantity, :unit_price, :subtotal])
    |> validate_required([:cart_id, :product_id, :quantity, :unit_price, :subtotal])
    |> validate_number(:quantity, greater_than: 0)
    |> unique_constraint([:cart_id, :product_id])
  end
end
