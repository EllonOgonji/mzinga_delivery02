defmodule MzingaDelivery.Accounts.WishlistItem do
  use Ecto.Schema
  import Ecto.Changeset

  schema "wishlist_items" do
    belongs_to :user, MzingaDelivery.Accounts.User
    belongs_to :product, MzingaDelivery.Stores.Product

    timestamps()
  end

  @doc false
  def changeset(wishlist_item, attrs) do
    wishlist_item
    |> cast(attrs, [:user_id, :product_id])
    |> validate_required([:user_id, :product_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:product_id)
    |> unique_constraint(:product_id, name: :wishlist_items_user_id_product_id_index)
  end
end
