defmodule MzingaDelivery.Delivery.DeliveryRequest do
  use Ecto.Schema
  import Ecto.Changeset

  schema "delivery_requests" do
    field :status, :string, default: "pending"
    belongs_to :order, MzingaDelivery.Orders.Order
    belongs_to :rider, MzingaDelivery.Accounts.User

    timestamps()
  end

  @valid_statuses ["pending", "accepted", "rejected"]

  @doc false
  def changeset(request, attrs) do
    request
    |> cast(attrs, [:order_id, :rider_id, :status])
    |> validate_required([:order_id, :rider_id])
    |> validate_inclusion(:status, @valid_statuses)
    |> unique_constraint([:order_id, :rider_id])
  end
end
