defmodule MzingaDelivery.Repo.Migrations.CreatePayments do
  use Ecto.Migration

  def change do
    create table(:payments) do
      add :order_id, references(:orders, on_delete: :delete_all), null: false
      add :transaction_id, :string
      add :amount, :decimal, precision: 10, scale: 2, null: false
      add :status, :string, default: "pending", null: false
      add :provider, :string, default: "M-pesa", null: false

      timestamps()
    end

  create index(:payments, [:order_id])
  create index(:payments, [:status])
  create unique_index(:payments, [:transaction_id])


  end
end
