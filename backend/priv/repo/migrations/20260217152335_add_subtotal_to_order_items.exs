defmodule MzingaDelivery.Repo.Migrations.AddSubtotalToOrderItems do
  use Ecto.Migration

  def up do
    execute "ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subtotal numeric"

    # Only alter unit_price if it exists (for local dev/test env compatibility)
    execute """
    DO $$
    BEGIN
      IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
        ALTER TABLE order_items ALTER COLUMN unit_price DROP NOT NULL;
      END IF;
    END
    $$;
    """
  end

  def down do
    execute "ALTER TABLE order_items DROP COLUMN IF EXISTS subtotal"
  end
end
