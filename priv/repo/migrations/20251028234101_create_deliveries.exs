defmodule MzingaDelivery.Repo.Migrations.CreateDeliveries do
  use Ecto.Migration

  def change do
    create table(:deliveries) do
      add :order_id, references(:orders, on_delete: :nilify_all), null: false
      add :rider_id, references(:users, on_delete: :nilify_all)
      add :status, :string, default: "pending", null: false
      add :pickup_time, :utc_datetime
      add :delivery_time, :utc_datetime

      timestamps()
    end

  create index(:deliveries, [:rider_id])
  create index(:deliveries, [:status])
  # Use an explicit name for the unique index to avoid conflicts with
  # any automatically generated index names.
  create unique_index(:deliveries, [:order_id], name: :deliveries_order_id_unique_index)


  end
end
