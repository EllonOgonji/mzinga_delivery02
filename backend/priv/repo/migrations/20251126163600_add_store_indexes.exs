defmodule MzingaDelivery.Repo.Migrations.AddStoreIndexes do
  use Ecto.Migration

  def up do
    create_if_not_exists index(:stores, [:name])
    create_if_not_exists index(:stores, [:status])

    execute """
    CREATE INDEX IF NOT EXISTS stores_metadata_gin_index
    ON stores USING GIN (metadata)
    """
  end

  def down do
    drop_if_exists index(:stores, [:name])
    drop_if_exists index(:stores, [:status])

    execute "DROP INDEX IF EXISTS stores_metadata_gin_index"
  end
end
