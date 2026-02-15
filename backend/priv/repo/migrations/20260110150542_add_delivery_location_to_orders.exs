defmodule MzingaDelivery.Repo.Migrations.AddDeliveryLocationToOrders do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      add :delivery_lat, :float
      add :delivery_lng, :float
    end
  end
end
