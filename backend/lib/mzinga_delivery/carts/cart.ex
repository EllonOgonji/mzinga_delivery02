defmodule MzingaDelivery.Carts.Cart do
  use Ecto.Schema
  import Ecto.Changeset

  schema "carts" do
    field :total_price, :decimal, default: Decimal.new("0.0")
    belongs_to :user, MzingaDelivery.Accounts.User
    belongs_to :store, MzingaDelivery.Stores.Store
    has_many :items, MzingaDelivery.Carts.CartItem

    timestamps()
  end

  @doc false
  def changeset(cart, attrs) do
    cart
    |> cast(attrs, [:user_id, :store_id, :total_price])
    |> validate_required([:user_id])
    |> unique_constraint(:user_id)
  end
end
