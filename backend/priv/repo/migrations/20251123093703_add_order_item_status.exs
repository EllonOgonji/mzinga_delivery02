defmodule MzingaDelivery.Repo.Migrations.AddOrderItemStatus do
  use Ecto.Migration

  def change do
    alter table(:order_items) do
      add :status, :string, default: "pending"
    end

    create index(:order_items, [:status])
  end
end
