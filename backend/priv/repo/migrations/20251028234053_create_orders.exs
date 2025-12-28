defmodule MzingaDelivery.Repo.Migrations.CreateOrders do
  use Ecto.Migration

  def change do
    create table(:orders) do
      add :customer_id, references(:users, on_delete: :nilify_all), null: false
      add :store_id, references(:stores, on_delete: :nilify_all), null: false
      add :total_price, :decimal, precision: 10, scale: 2, null: false
      add :payment_status, :string, default: "pending", null: false
      add :order_status, :string, default: "pending", null: false

      timestamps()
    end

    create index(:orders, [:customer_id])
    create index(:orders, [:store_id])
    create index(:orders, [:order_status])
    create index(:orders, [:payment_status])
    create index(:orders, [:inserted_at])

  end
end
