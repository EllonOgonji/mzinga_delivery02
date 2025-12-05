defmodule MzingaDelivery.Repo.Migrations.AddApprovalFieldsToStores do
  use Ecto.Migration

  def up do
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

    drop_if_exists constraint(:stores, :status_must_be_valid)

    create constraint(:stores, :status_must_be_valid,
             check:
               "status IN ('pending', 'approved', 'rejected', 'active', 'inactive', 'suspended', 'open', 'closed')"
           )
  end

  def down do
    drop constraint(:stores, :status_must_be_valid)
    create constraint(:stores, :status_must_be_valid, check: "status IN ('open', 'closed')")

    drop index(:stores, [:status, :is_verified])
    drop index(:stores, [:rejected_by_id])
    drop index(:stores, [:approved_by_id])

    execute """
            ALTER TABLE stores
            ALTER COLUMN status SET DEFAULT 'active'
            """,
            """
            ALTER TABLE stores
            ALTER COLUMN status SET DEFAULT 'pending'
            """

    alter table(:stores) do
      remove :rejected_by_id
      remove :rejected_at
      remove :approved_by_id
      remove :approved_at
      remove :rejection_reason
    end
  end
end
