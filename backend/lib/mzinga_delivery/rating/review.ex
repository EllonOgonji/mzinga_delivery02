defmodule MzingaDelivery.Rating.Review do
  use Ecto.Schema
  import Ecto.Changeset

  schema "reviews" do
    field :rating, :integer
    field :comment, :string
    belongs_to :order, MzingaDelivery.Orders.Order
    belongs_to :customer, MzingaDelivery.Accounts.User
    belongs_to :rider, MzingaDelivery.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(review, attrs) do
    review
    |> cast(attrs, [:rating, :comment, :order_id, :customer_id, :rider_id])
    |> validate_required([:rating, :order_id, :customer_id, :rider_id])
    |> validate_number(:rating, greater_than_or_equal_to: 1, less_than_or_equal_to: 5)
    |> unique_constraint(:order_id, name: :reviews_order_id_unique_index)
  end
end
