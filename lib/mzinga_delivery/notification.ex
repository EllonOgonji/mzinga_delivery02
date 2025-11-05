defmodule MzingaDelivery.Notifications do
  @moduledoc """
  Notification context - manages notification records.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Notifications.Notification

  @doc """
  Return the list of notifications for a user.
  """
  def list_user_notifications(user_id) do
    Notification
    |> where([n], n.user_id == ^user_id)
    |> order_by([n], desc: n.inserted_at)
    |> Repo.all()
  end

  @doc """
  Returns unread notifications for user.
  """
  def list_unread_notifications(user_id) do
    Notification
    |> where([n], n.user_id == ^user_id and n.is_read == false)
    |> order_by([n], desc: n.inserted_at)
    |> Repo.all()
  end

  @doc """
  Gets a single notification.
  """
  def get_notification!(id), do: Repo.get!(Notification, id)

  @doc """
  Creates a notification.
  """
  def create_notification(attrs \\ %{}) do
    %Notification{}
    |> Notification.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Marks a notification as read.
  """
  def mark_as_read(%Notification{} = notification) do
    notification
    |> Notification.changeset(%{is_read: true})
    |> Repo.update()
  end

  @doc """
  Marks all notifications as read for a user.
  Returns {count, _} from Repo.update_all/3.
  """
  def mark_all_as_read(user_id) do
    Notification
    |> where([n], n.user_id == ^user_id and n.is_read == false)
    |> Repo.update_all(set: [is_read: true])
  end

  @doc """
  Deletes a notification.
  """
  def delete_notification(%Notification{} = notification) do
    Repo.delete(notification)
  end
end
