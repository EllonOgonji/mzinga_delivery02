defmodule MzingaDeliveryWeb.NotificationController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Notifications
  alias MzingaDelivery.Auth.Guardian

  action_fallback MzingaDeliveryWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    notifications = Notifications.list_user_notifications(user.id)

    render(conn, "index.json", notifications: notifications)
  end

  def unread(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    notifications = Notifications.list_unread_notifications(user.id)

    render(conn, "index.json", notifications: notifications)
  end

  def mark_as_read(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    notification = Notifications.get_notification!(id)

    if notification.user_id == user.id do
      case Notifications.mark_as_read(notification) do
        {:ok, _notification} ->
          render(conn, "show.json", notification: notification)

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render("error.json", changeset: changeset)
      end
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "Not authorized"})
    end
  end

  def mark_all_as_read(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    {count, _} = Notifications.mark_all_as_read(user.id)

    json(conn, %{message: "#{count} notifications marked as read"})
  end
end
