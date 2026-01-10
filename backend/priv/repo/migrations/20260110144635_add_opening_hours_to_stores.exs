defmodule MzingaDelivery.Repo.Migrations.AddOpeningHoursToStores do
  use Ecto.Migration

  def change do
    alter table(:stores) do
      add :is_open, :boolean, default: true, null: false
      add :closing_time, :time
    end
  end
end
