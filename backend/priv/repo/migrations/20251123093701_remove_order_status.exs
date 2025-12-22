defmodule MzingaDelivery.Repo.Migrations.RemoveOrderStatus do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      remove :order_status
    end
  end
end
