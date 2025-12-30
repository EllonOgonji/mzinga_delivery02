defmodule MzingaDelivery.Repo.Migrations.CreateReviews do
  use Ecto.Migration

  def change do
    create table(:reviews) do
      add :rating, :integer, null: false
      add :comment, :text
      add :order_id, references(:orders, on_delete: :delete_all), null: false
      add :customer_id, references(:users, on_delete: :nothing), null: false
      add :rider_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:reviews, [:order_id])
    create index(:reviews, [:customer_id])
    create index(:reviews, [:rider_id])
    create unique_index(:reviews, [:order_id], name: :reviews_order_id_unique_index)
  end
end
