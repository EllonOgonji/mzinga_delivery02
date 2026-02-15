defmodule MzingaDelivery.Repo.Migrations.AddStoreAttributes do
  use Ecto.Migration

  def change do
    alter table(:stores) do
      add :logo, :string
      add :banner, :string
      add :category, :string
    end

    create index(:stores, [:category])
  end
end
