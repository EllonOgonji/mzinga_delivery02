defmodule MzingaDelivery.Repo.Migrations.CreateStores do
  use Ecto.Migration

  def change do
    create table(:stores) do
      add :vendor_id , references(:users, on_delete: :delete_all), null: false
      add :name, :string, null: false
      add :address, :string, null: false
      add :latitude, :decimal, precision: 10, scale: 8
      add :longitude, :decimal, precision: 11, scale: 8
      add :status, :string , default: "open", null: false

      timestamps()

    end
    create index(:stores, [:vendor_id])
    create index(:stores, [:status])
    create constraint(:stores, :status_must_be_valid, check: "status IN ('open', 'closed')" )

  end
end
