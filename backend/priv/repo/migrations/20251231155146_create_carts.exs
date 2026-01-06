defmodule MzingaDelivery.Repo.Migrations.CreateCarts do
  use Ecto.Migration

  def change do
    create table(:carts) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :store_id, references(:stores, on_delete: :delete_all), null: false
      add :total_price, :decimal, default: 0.0

      timestamps()
    end

    create unique_index(:carts, [:user_id])
    create index(:carts, [:store_id])

    create table(:cart_items) do
      add :cart_id, references(:carts, on_delete: :delete_all), null: false
      add :product_id, references(:products, on_delete: :delete_all), null: false
      add :quantity, :integer, null: false
      add :unit_price, :decimal, null: false
      add :subtotal, :decimal, null: false

      timestamps()
    end

    create index(:cart_items, [:cart_id])
    create index(:cart_items, [:product_id])
    create unique_index(:cart_items, [:cart_id, :product_id])
  end
end
