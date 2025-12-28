defmodule MzingaDelivery.Repo do
  use Ecto.Repo,
    otp_app: :mzinga_delivery,
    adapter: Ecto.Adapters.Postgres
end
