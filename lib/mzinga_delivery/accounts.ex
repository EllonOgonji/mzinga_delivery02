defmodule MzingaDelivery.Accounts do
  @moduledoc """
  Account context -- handles user authentication and management.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Accounts.User

  @doc """
  returns list of users
  """
  def list_users do
    Repo.all(User)
    end

  @doc """
  gets single user
  """
  def get_user(id) do
    Repo.get(User, id)
  end

  @doc """
  gets single user by email
  """
  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

      @doc """
      Creates a user.
      """
      def create_user(attrs \\ %{}) do
        %User{}
        |> User.changeset(attrs)
        |> Repo.insert()
      end

  @doc """
  Updates a user.
  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.update_changeset(attrs)
    |> Repo.update()
  end


  @doc """
  delete user
  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end


  @doc """
  authenticate user by email and password
  returns {:ok, user} or {:error, :unauthorized}
  """
  def authenticate_user(email, password) do
    case Repo.get_by(User, email: email) do
      nil ->
        Bcrypt.no_user_verify()
        {:error, :unauthorized}

      user ->
        if Bcrypt.verify_pass(password, user.password_hash) do
          {:ok, user}
        else
          {:error, :unauthorized}
        end
    end
  end


  @doc """
  return list of users by role
  """
  def list_users_by_role(role) do
    User
    |> where([u], u.role == ^role)
    |> Repo.all()
  end
end
