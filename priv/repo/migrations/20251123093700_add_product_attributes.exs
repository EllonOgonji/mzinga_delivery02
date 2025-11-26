defmodule MzingaDelivery.Repo.Migrations.AddProductAttributes do
  use Ecto.Migration

  def change do
    alter table(:products) do
      add :compare_at_price, :decimal, precision: 10, scale: 2
      add :ratings, {:array, :decimal}, default: []
      add :specification, :map, default: %{}
      add :status, :string, default: "active"
    end

    create index(:products, [:status])
  end
end
