defmodule MzingaDelivery.Orders.Order do
  use Ecto.Schema
  import Ecto.Changeset

  schema "orders" do
    field :total_price, :decimal
    field :payment_status, :string, default: "pending"
    field :order_status, :string, default: "pending"

  belongs_to :customer, MzingaDelivery.Accounts.User
  belongs_to :store, MzingaDelivery.Stores.Store
    has_many :order_items, MzingaDelivery.Orders.OrderItem
    has_one :payment, MzingaDelivery.Payments.Payment

    timestamps()
  end

  @doc false
  def changeset(order, attrs) do
    order
  |> cast(attrs, [:customer_id, :store_id, :total_price, :payment_status, :order_status])
  |> validate_required([:customer_id, :store_id, :total_price])
    |> validate_number(:total_price, greater_than: 0)
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])
    |> validate_inclusion(:order_status, ["pending", "accepted", "rejected", "awaiting_pickup", "in_transit", "delivered", "cancelled"])
    |> foreign_key_constraint(:customer_id)
    |> foreign_key_constraint(:store_id)
  end

  def update_status_changeset(order, attrs) do
    order
    |> cast(attrs, [:order_status, :payment_status])
    |> validate_inclusion(:payment_status, ["pending", "paid", "failed", "refunded"])
    |> validate_inclusion(:order_status, ["pending", "accepted", "rejected", "awaiting_pickup", "in_transit", "delivered", "cancelled"])
  end
end
