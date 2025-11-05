defmodule MzingaDelivery.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :full_name, :string
    field :email, :string
    field :phone, :string
    field :role, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    # Associations
    has_many :stores, MzingaDelivery.Stores.Store, foreign_key: :vendor_id
    has_many :orders, MzingaDelivery.Orders.Order, foreign_key: :customer_id
    has_many :notifications, MzingaDelivery.Notifications.Notification

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:full_name, :email, :phone, :role, :password, :password_confirmation])
    |> validate_required([:full_name, :email, :phone, :role, :password])
    |> validate_format(:email, ~r/@/)
    |> validate_format(:phone, ~r/^254\d{9}$/, message: "must be valid Kenyan number (254...)")
    |> validate_length(:password, min: 6)
    |> validate_confirmation(:password)
    |> unique_constraint(:email)
    |> validate_inclusion(:role, ["customer", "vendor", "rider", "admin"])
    |> hash_password()
  end

  # Update changeset (without requiring password)
  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:full_name, :email, :phone])
    |> validate_required([:full_name, :email, :phone])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  defp hash_password(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    changeset
    |> put_change(:password_hash, Bcrypt.hash_pwd_salt(password))
    |> delete_change(:password)
    |> delete_change(:password_confirmation)
  end

  defp hash_password(changeset), do: changeset
end
