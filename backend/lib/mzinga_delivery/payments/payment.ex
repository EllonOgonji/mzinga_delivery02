defmodule MzingaDelivery.Payments.Payment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "payments" do
    field :transaction_id, :string
    field :amount, :decimal
    field :status, :string, default: "pending"
    field :provider, :string, default: "M-Pesa"

    belongs_to :order, MzingaDelivery.Orders.Order

    timestamps()
  end

  @doc false
  def changeset(payment, attrs) do
    payment
    |> cast(attrs, [:order_id, :transaction_id, :amount, :status, :provider])
    |> validate_required([:order_id, :amount])
    |> validate_inclusion(:status, ["pending", "completed", "failed", "cancelled"])
    |> foreign_key_constraint(:order_id)
  end
end
