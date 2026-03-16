defmodule MzingaDelivery.Payments.Payment do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder,
           only: [:status, :amount, :transaction_id, :checkout_group_id, :order_id]}
  schema "payments" do
    field(:transaction_id, :string)
    field(:amount, :decimal)
    field(:status, :string, default: "pending")
    field(:provider, :string, default: "M-Pesa")
    field(:checkout_group_id, Ecto.UUID)

    belongs_to(:order, MzingaDelivery.Orders.Order)

    timestamps()
  end

  @doc false
  def changeset(payment, attrs) do
    payment
    |> cast(attrs, [:order_id, :transaction_id, :amount, :status, :provider, :checkout_group_id])
    |> validate_required([:amount])
    |> validate_inclusion(:status, ["pending", "completed", "failed", "cancelled"])
    |> foreign_key_constraint(:order_id)
  end
end
