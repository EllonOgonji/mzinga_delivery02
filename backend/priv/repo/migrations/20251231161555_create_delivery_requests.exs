defmodule MzingaDelivery.Repo.Migrations.CreateDeliveryRequests do
  use Ecto.Migration

  def change do
    create table(:delivery_requests) do
      add :order_id, references(:orders, on_delete: :delete_all), null: false
      add :rider_id, references(:users, on_delete: :delete_all), null: false
      # pending, accepted, rejected
      add :status, :string, default: "pending"

      timestamps()
    end

    create index(:delivery_requests, [:order_id])
    create index(:delivery_requests, [:rider_id])
    create unique_index(:delivery_requests, [:order_id, :rider_id])
  end
end
