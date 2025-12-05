defmodule MzingaDelivery.Repo.Migrations.UpdateStoreStatusConstraint do
  use Ecto.Migration

  def up do
    drop constraint(:stores, :status_must_be_valid)

    create constraint(:stores, :status_must_be_valid,
             check:
               "status IN ('pending', 'approved', 'rejected', 'active', 'inactive', 'suspended', 'open', 'closed', 'Open', 'Closed')"
           )
  end

  def down do
    drop constraint(:stores, :status_must_be_valid)
    create constraint(:stores, :status_must_be_valid, check: "status IN ('open', 'closed')")
  end
end
