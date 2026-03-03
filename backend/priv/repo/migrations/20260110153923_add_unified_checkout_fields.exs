defmodule MzingaDelivery.Repo.Migrations.AddUnifiedCheckoutFields do
  use Ecto.Migration

  def change do
    alter table(:orders) do
      add :checkout_group_id, :uuid
    end

    alter table(:payments) do
      add :checkout_group_id, :uuid
      modify :order_id, :bigint, null: true, from: :bigint
    end
  end
end
