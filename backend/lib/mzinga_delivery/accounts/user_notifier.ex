defmodule MzingaDelivery.Accounts.UserNotifier do
  import Swoosh.Email

  alias MzingaDelivery.Mailer

  # In a real app this would come from config
  @frontend_url "http://localhost:3000"

  def send_password_reset_instructions(user) do
    url = "#{@frontend_url}/reset-password?token=#{user.reset_password_token}"

    email =
      new()
      |> to({user.full_name, user.email})
      |> from({"Mzinga Delivery", "noreply@mzingadelivery.com"})
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
