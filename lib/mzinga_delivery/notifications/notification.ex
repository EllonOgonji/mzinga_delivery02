defmodule MzingaDelivery.Notifications.Notification do
  use Ecto.Schema
  import Ecto.Changeset

  schema "notifications" do
    field :message, :string
    field :type, :string
    field :is_read, :boolean, default: false

    belongs_to :user, MzingaDelivery.Accounts.User

    timestamps()
  end

  @doc false
  def changeset(notification, attrs) do
    notification
    |> cast(attrs, [:user_id, :message, :type, :is_read])
    |> validate_required([:user_id, :message, :type])
    |> validate_inclusion(:type, ["new_order", "order_accepted", "order_rejected", "payment_completed", "order_delivered"])
    |> foreign_key_constraint(:user_id)
  end
end
