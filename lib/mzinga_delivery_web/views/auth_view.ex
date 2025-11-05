defmodule MzingaDeliveryWeb.AuthView do
  use MzingaDeliveryWeb, :view

  def render("auth.json", %{user: user, token: token}) do
    %{
      data: %{
        user: %{
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },

        token: token

        }
      }
  end

  def render("user.json", %{user: user}) do
     %{
      data: %{
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
     }
  end

  def render("error.json", %{changeset: changeset}) do
    %{
      errors: translate_errors(changeset)
    }
  end

  def render("error.json", %{message: message}) do
    %{
      errors: message
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
