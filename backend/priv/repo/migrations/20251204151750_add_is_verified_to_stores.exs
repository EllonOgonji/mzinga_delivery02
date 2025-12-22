defmodule MzingaDelivery.Repo.Migrations.AddIsVerifiedToStores do
  use Ecto.Migration

  def change do
    alter table(:stores) do
      add :is_verified, :boolean, default: false, null: false
    end

    create index(:stores, [:is_verified])
  end
end
