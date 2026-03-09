defmodule MzingaDelivery.Orders.Order do
  use Ecto.Schema
  import Ecto.Changeset

  schema "orders" do
    field(:total_price, :decimal)
    field(:delivery_fee, :decimal, default: 0.0)
    field(:payment_status, :string, default: "pending")
    field(:delivery_lat, :float)
    field(:delivery_lng, :float)
    field(:checkout_group_id, Ecto.UUID)
    # field :order_status, :string, default: "pending"

    belongs_to(:customer, MzingaDelivery.Accounts.User)
    belongs_to(:store, MzingaDelivery.Stores.Store)
    belongs_to(:rider, MzingaDelivery.Accounts.User)
    has_many(:order_items, MzingaDelivery.Orders.OrderItem)
    has_one(:payment, MzingaDelivery.Payments.Payment)

    timestamps()
  end

  @doc false
  def changeset(order, attrs) do
    order
    |> cast(attrs, [
      :customer_id,
      :store_id,
      :total_price,
      :delivery_fee,
      :payment_status,
      :rider_id,
      :delivery_lat,
      :delivery_lng,
      :checkout_group_id
    ])
    |> validate_required([:customer_id, :store_id, :total_price, :delivery_fee])
    |> validate_number(:total_price, greater_than: 0)
    |> validate_number(:delivery_fee, greater_than_or_equal_to: 0)
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])
    # |> validate_inclusion(:order_status, ["pending", "accepted", "rejected", "awaiting_pickup", "in_transit", "delivered", "cancelled"])
    |> foreign_key_constraint(:customer_id)
    |> foreign_key_constraint(:store_id)
    |> foreign_key_constraint(:rider_id)
  end

  def update_status_changeset(order, attrs) do
    order
    |> cast(attrs, [:payment_status])
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])

    # |> validate_inclusion(:order_status, ["pending", "accepted", "rejected", "awaiting_pickup", "in_transit", "delivered", "cancelled"])
  end
end
