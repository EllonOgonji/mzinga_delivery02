defmodule MzingaDeliveryWeb.Admin.StoreJSON do
  def index(%{stores: stores}) do
    %{data: Enum.map(stores, &store_json/1)}
  end

  def show(%{store: store}) do
    %{data: store_json(store)}
  end

  def error(%{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  defp store_json(store) do
    %{
      id: store.id,
      name: store.name,
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      status: store.status,
      is_verified: store.is_verified,
      logo: store.logo,
      banner: store.banner,
      category: store.category,
      rejection_reason: store.rejection_reason,
      approved_at: store.approved_at,
      rejected_at: store.rejected_at,
      vendor: %{
        id: store.vendor.id,
        full_name: store.vendor.full_name,
        email: store.vendor.email,
        phone: store.vendor.phone
      },
      approved_by: render_admin(store.approved_by),
      rejected_by: render_admin(store.rejected_by),
      inserted_at: store.inserted_at,
      updated_at: store.updated_at
    }
  end

  defp render_admin(nil), do: nil

  defp render_admin(admin) do
    %{
      id: admin.id,
      full_name: admin.full_name,
      email: admin.email
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
