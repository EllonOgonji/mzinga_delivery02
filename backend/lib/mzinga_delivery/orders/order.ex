defmodule MzingaDelivery.Orders.Order do
  use Ecto.Schema
  import Ecto.Changeset

  schema "orders" do
    field :total_price, :decimal
    field :payment_status, :string, default: "pending"
    # pending, assigned, picked_up, delivered, cancelled
    field :delivery_status, :string, default: "pending"
    field :delivery_lat, :float
    field :delivery_lng, :float

    belongs_to :customer, MzingaDelivery.Accounts.User
    belongs_to :store, MzingaDelivery.Stores.Store
    belongs_to :rider, MzingaDelivery.Accounts.User
    has_many :order_items, MzingaDelivery.Orders.OrderItem
    has_one :payment, MzingaDelivery.Payments.Payment

    timestamps()
  end

  @doc false
  def changeset(order, attrs) do
    order
    |> cast(attrs, [
      :customer_id,
      :store_id,
      :total_price,
      :payment_status,
      :rider_id,
      :delivery_status,
      :delivery_lat,
      :delivery_lng
    ])
    |> validate_required([:customer_id, :store_id, :total_price])
    |> validate_number(:total_price, greater_than: 0)
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])
    |> validate_inclusion(:delivery_status, [
      "pending",
      "assigned",
      "ready_for_pickup",
      "picked_up",
      "delivered",
      "cancelled"
    ])
    |> foreign_key_constraint(:customer_id)
    |> foreign_key_constraint(:store_id)
    |> foreign_key_constraint(:rider_id)
  end

  def status_changeset(order, attrs) do
    order
    |> cast(attrs, [:payment_status, :delivery_status])
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])
    |> validate_inclusion(:delivery_status, [
      "pending",
      "assigned",
      "ready_for_pickup",
      "picked_up",
      "delivered",
      "cancelled"
    ])
  end
end
