defmodule MzingaDelivery.Repo.Migrations.AddApprovalFieldsToStores do
  use Ecto.Migration

  def change do
    alter table(:stores) do
      add :rejection_reason, :text
      add :approved_at, :utc_datetime
      add :approved_by_id, references(:users, on_delete: :nilify_all)
      add :rejected_at, :utc_datetime
      add :rejected_by_id, references(:users, on_delete: :nilify_all)
    end

    # Update existing status field default (if needed)
    execute """
            ALTER TABLE stores
            ALTER COLUMN status SET DEFAULT 'pending'
            """,
            """
            ALTER TABLE stores
            ALTER COLUMN status SET DEFAULT 'active'
            """

    # Create indexes
    create index(:stores, [:approved_by_id])
    create index(:stores, [:rejected_by_id])
    create index(:stores, [:status, :is_verified])
  end
end
