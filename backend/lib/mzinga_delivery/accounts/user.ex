defmodule MzingaDelivery.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :full_name, :string
    field :email, :string
    field :phone_number, :string
    field :role, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :avatar_url, :string
    field :reset_password_token, :string
    field :reset_password_sent_at, :utc_datetime

    # Associations
    has_many :stores, MzingaDelivery.Stores.Store, foreign_key: :vendor_id
    has_many :orders, MzingaDelivery.Orders.Order, foreign_key: :customer_id
    has_many :notifications, MzingaDelivery.Notifications.Notification

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :full_name,
      :email,
      :phone_number,
      :role,
      :password,
      :password_confirmation,
      :avatar_url
    ])
    |> validate_required([:full_name, :email, :phone_number, :role, :password])
    |> validate_format(:email, ~r/@/)
    |> validate_format(:phone_number, ~r/^254\d{9}$/,
      message: "must be valid Kenyan number (254...)"
    )
    |> validate_length(:password, min: 6)
    |> validate_confirmation(:password)
    |> unique_constraint(:email)
    |> validate_inclusion(:role, ["customer", "vendor", "rider", "admin"])
    |> hash_password()
  end

  # Update changeset (without requiring password)
  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:full_name, :email, :phone_number, :avatar_url])
    |> validate_required([:full_name, :email, :phone_number])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  @doc """
  Changeset for resetting the password.
  Clears the token and updates the password hash.
  """
  def reset_password_changeset(user, attrs) do
    user
    |> cast(attrs, [:password, :password_confirmation])
    |> validate_required([:password, :password_confirmation])
    |> validate_length(:password, min: 6)
    |> validate_confirmation(:password)
    |> put_change(:reset_password_token, nil)
    |> put_change(:reset_password_sent_at, nil)
    |> hash_password()
  end

  defp hash_password(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    changeset
    |> put_change(:password_hash, Bcrypt.hash_pwd_salt(password))
    |> delete_change(:password)
    |> delete_change(:password_confirmation)
  end

  defp hash_password(changeset), do: changeset
end
