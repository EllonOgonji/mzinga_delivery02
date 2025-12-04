defmodule MzingaDeliveryWeb.StoreJSON do
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
      logo: store.logo,
      banner: store.banner,
      category: store.category,
      is_verified: store.is_verified,
      vendor: %{
        id: store.vendor.id,
        full_name: store.vendor.full_name,
        phone: store.vendor.phone
      },
      inserted_at: store.inserted_at,
      updated_at: store.updated_at
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
