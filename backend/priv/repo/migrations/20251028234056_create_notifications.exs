defmodule MzingaDelivery.Repo.Migrations.CreateNotifications do
  use Ecto.Migration

  def change do
    create table(:notifications) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :message, :text, null: false
      add :type, :string, null: false
      add :is_read, :boolean, default: false, null: false

      timestamps()
    end

    create index(:notifications, [:user_id])
    create index(:notifications, [:is_read])
    create index(:notifications, [:inserted_at])

  end
end
