defmodule MzingaDeliveryWeb.NotificationView do
  use MzingaDeliveryWeb, :view

  def render("index.json", %{notifications: notifications}) do
    %{data: Enum.map(notifications, &notification_json/1)}
  end

  def render("show.json", %{notification: notification}) do
    %{data: notification_json(notification)}
  end

  def render("error.json", %{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp notification_json(notification) do
    %{
      id: notification.id,
      message: notification.message,
      type: notification.type,
      is_read: notification.is_read,
      user_id: notification.user_id,
      created_at: notification.inserted_at,
      updated_at: notification.updated_at
    }
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

end
