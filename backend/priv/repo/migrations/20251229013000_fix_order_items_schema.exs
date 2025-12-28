defmodule MzingaDelivery.Repo.Migrations.FixOrderItemsSchema do
  use Ecto.Migration

  def change do
    alter table(:order_items) do
      add :subtotal, :decimal, precision: 10, scale: 2
      remove :unit_price
    end
  end
end
