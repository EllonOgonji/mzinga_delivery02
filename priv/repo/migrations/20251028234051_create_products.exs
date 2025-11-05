defmodule MzingaDelivery.Repo.Migrations.CreateProducts do
  use Ecto.Migration

  def change do
   create table(:products) do
    add :store_id, references(:stores, on_delete: :delete_all), null: false
    add :name, :string, null: false
    add :description, :text
    add :price, :decimal, precision: 10, scale: 2, null: false
    add :stock, :integer, default: 0, null: false
    add :available, :boolean, default: true, null: false
    add :image_url, :text
    add :category, :string

    timestamps()
   end
    create index(:products, [:store_id])
    create index(:products, [:category])


  end
end
