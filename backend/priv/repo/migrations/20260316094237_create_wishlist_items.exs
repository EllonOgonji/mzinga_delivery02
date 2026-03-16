defmodule MzingaDelivery.Repo.Migrations.CreateWishlistItems do
  use Ecto.Migration

  def change do
    create table(:wishlist_items) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :product_id, references(:products, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:wishlist_items, [:user_id])
    create index(:wishlist_items, [:product_id])
    create unique_index(:wishlist_items, [:user_id, :product_id])
  end
end
