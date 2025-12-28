defmodule MzingaDelivery.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :full_name, :string, null: false
      add :email, :string, null: false
      add :phone_number, :string, null: false
      add :role, :string, null: false
      add :password_hash, :string, null: false

      timestamps()
    end

    create unique_index(:users, [:email])
  create index(:users, [:role])

  end
end
