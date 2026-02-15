defmodule MzingaDelivery.Repo.Migrations.AddRiderFieldsToOrders do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      add :rider_id, references(:users, on_delete: :nothing)
      add :delivery_status, :string, default: "pending"
    end

    create index(:orders, [:rider_id])
  end
end
