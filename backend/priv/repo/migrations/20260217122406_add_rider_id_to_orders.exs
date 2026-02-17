defmodule MzingaDelivery.Repo.Migrations.AddRiderIdToOrders do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE orders ADD COLUMN IF NOT EXISTS rider_id bigint REFERENCES users(id) ON DELETE SET NULL"
    create_if_not_exists index(:orders, [:rider_id])
  end

  def down do
    alter table(:orders) do
      remove :rider_id
    end
  end
end
