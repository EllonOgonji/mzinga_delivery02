defmodule MzingaDelivery.Repo.Migrations.ModifyCartsMakeStoreIdNullable do
  use Ecto.Migration

  def change do
    alter table(:carts) do
      modify :store_id, :id, null: true, from: references(:stores)
    end
  end
end
