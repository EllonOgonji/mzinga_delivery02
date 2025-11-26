defmodule MzingaDelivery.Repo.Migrations.AddGinIndexToProductsSpecifications do
  use Ecto.Migration

  def up do
    execute """
    CREATE INDEX IF NOT EXISTS products_specifications_gin_index
    ON products USING GIN (specifications);
    """

    # Create indexes for common filter fields
    create_if_not_exists index(:products, [:category])
    create_if_not_exists index(:products, [:price])
    create_if_not_exists index(:products, [:status])
  end

  def down do
    execute "DROP INDEX IF EXISTS products_specifications_gin_index;"
    drop_if_exists index(:products, [:category])
    drop_if_exists index(:products, [:price])
    drop_if_exists index(:products, [:status])
  end
end
