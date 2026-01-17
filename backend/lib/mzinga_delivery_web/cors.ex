defmodule MzingaDeliveryWeb.CORS do
  @moduledoc """
  Dynamic CORS configuration.
  Allows checking allowed origins at runtime, enabling `runtime.exs` updates.
  """

  require Logger

  @doc """
  Returns the list of allowed origins.
  Used by CORSPlug to validate requests.
  """
  def origins(_conn) do
    # 1. Get Dynamic Config (safely)
    dynamic_origins =
      case Application.get_env(:mzinga_delivery, :cors_origins) do
        list when is_list(list) -> list
        _ -> []
      end

    # 2. Hardcoded Backup (ensures Vercel always works even if config fails)
    static_origins = [
      "https://mzinga-delivery.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      "http://192.168.0.112:8080"
    ]

    # Combine and Deduplicate
    (static_origins ++ dynamic_origins) |> Enum.uniq()
  end
end
