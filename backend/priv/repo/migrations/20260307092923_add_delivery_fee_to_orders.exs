defmodule MzingaDelivery.Repo.Migrations.AddDeliveryFeeToOrders do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      add :delivery_fee, :decimal, default: 0.0, null: false
    end
  end
end
