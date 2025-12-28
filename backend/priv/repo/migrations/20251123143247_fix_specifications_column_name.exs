defmodule MzingaDelivery.Repo.Migrations.FixSpecificationsColumnName do
  use Ecto.Migration

  def change do
    rename table(:products), :specification, to: :specifications
  end
end
