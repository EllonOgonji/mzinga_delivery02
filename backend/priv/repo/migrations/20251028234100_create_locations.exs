defmodule MzingaDelivery.Repo.Migrations.CreateLocations do
  use Ecto.Migration

  def change do
    create table(:locations) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :latitude, :decimal, precision: 10, scale: 8, null: false
      add :longitude, :decimal, precision: 11, scale: 8, null: false
      add :address, :text

      timestamps()
    end

    create index(:locations, [:user_id])

  end
end
