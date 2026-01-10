defmodule MzingaDeliveryWeb.CORS do
  @moduledoc """
  Dynamic CORS configuration.
  Allows checking allowed origins at runtime, enabling `runtime.exs` updates.
  """

  def allow?(origin) do
    # Fetch allowed origins from Application config (which runtime.exs updates)
    allowed_origins =
      Application.get_env(:cors_plug, :origin) || []

    # Check matches
    origin in allowed_origins
  end
end
