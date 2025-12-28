defmodule MzingaDeliveryWeb.RiderView do
  use MzingaDeliveryWeb, :view

  def render("rider.json", %{user: user}) do
    %{
      data: %{
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        is_available: user.is_available,
        last_lat: user.last_lat,
        last_lng: user.last_lng
      }
    }
  end

  def render("error.json", %{changeset: changeset}) do
    %{
      errors:
        Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
          Enum.reduce(opts, msg, fn {key, value}, acc ->
            String.replace(acc, "%{#{key}}", to_string(value))
          end)
        end)
    }
  end
end
