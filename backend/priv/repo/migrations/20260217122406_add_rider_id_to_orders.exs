defmodule MzingaDelivery.Repo.Migrations.AddRiderIdToOrders do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      add :rider_id, references(:users, on_delete: :nilify_all)
    end

    create index(:orders, [:rider_id])
  end
end
