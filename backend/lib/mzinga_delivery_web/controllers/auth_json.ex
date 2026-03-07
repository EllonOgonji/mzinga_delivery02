defmodule MzingaDeliveryWeb.AuthJSON do
  @doc """
  Renders authentication response with user and token.
  """
  def auth(%{user: user, token: token}) do
    %{
      data: %{
        user: %{
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          role: user.role,
          avatar_url: user.avatar_url
        },
        token: token
      }
    }
  end

  @doc """
  Renders user data.
  """
  def user(%{user: user}) do
    %{
      data: %{
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        avatar_url: user.avatar_url
      }
    }
  end

  @doc """
  Renders error response.
  """
  def error(%{changeset: changeset}) do
    %{
      errors: translate_errors(changeset)
    }
  end

  def error(%{message: message}) do
    %{
      error: message
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
