defmodule MzingaDelivery.Repo.Migrations.AddMetadataToStores do
  use Ecto.Migration

  def change do
    alter table(:stores) do
      add :metadata, :map, default: %{}, null: false
    end
  end
end
