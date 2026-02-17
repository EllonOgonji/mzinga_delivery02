defmodule MzingaDelivery.Repo.Migrations.AddSubtotalToOrderItems do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subtotal numeric"
    execute "ALTER TABLE order_items ALTER COLUMN unit_price DROP NOT NULL"
  end

  def down do
    execute "ALTER TABLE order_items DROP COLUMN IF EXISTS subtotal"
  end
end
