defmodule MzingaDelivery.Repo.Migrations.AddRiderFieldsToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :is_available, :boolean, default: false
      add :last_lat, :float
      add :last_lng, :float
    end
  end
end
