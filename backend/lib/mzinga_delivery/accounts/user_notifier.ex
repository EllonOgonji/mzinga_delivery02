defmodule MzingaDelivery.Accounts.UserNotifier do
  import Swoosh.Email

  alias MzingaDelivery.Mailer

  def send_password_reset_instructions(user) do
    frontend_url = Application.get_env(:mzinga_delivery, :frontend_url, "http://localhost:3000")
    url = "#{frontend_url}/auth/reset/#{user.reset_password_token}"

    email =
      new()
      |> to({user.full_name, user.email})
      |> from({"Mzinga Delivery", "stoneportus@gmail.com"})
      |> subject("Reset Password Instructions")
      |> html_body("""
      <h1>Hi #{user.full_name},</h1>
      <p>You can reset your password by clicking the link below:</p>
      <p><a href="#{url}">Reset password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      """)
      |> text_body("""
      Hi #{user.full_name},

      You can reset your password by visiting the link below:

      #{url}

      If you didn't request this, please ignore this email.
      """)

    with {:ok, _metadata} <- Mailer.deliver(email) do
      {:ok, email}
    end
  end
end
