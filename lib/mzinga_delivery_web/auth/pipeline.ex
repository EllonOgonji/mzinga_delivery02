defmodule MzingaDeliveryWeb.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :mzinga_delivery,
    module: MzingaDelivery.Auth.Guardian,
    error_handler: MzingaDeliveryWeb.Auth.ErrorHandler

  plug Guardian.Plug.VerifyHeader, scheme: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
