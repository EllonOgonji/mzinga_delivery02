defmodule MzingaDeliveryWeb.CORS do
  @moduledoc """
  Dynamic CORS configuration.
  Allows checking allowed origins at runtime, enabling `runtime.exs` updates.
  """

  require Logger

  def allow?(%Plug.Conn{} = conn) do
    # CORSPlug passes the conn, so we extract the origin header
    case Plug.Conn.get_req_header(conn, "origin") do
      [origin | _] -> allow?(origin)
      # Allow requests with no origin (non-browser)
      [] -> true
    end
  end

  def allow?(origin) do
    # 1. Get Dynamic Config (safely)
    dynamic_origins =
      case Application.get_env(:cors_plug, :origin) do
        list when is_list(list) -> list
        _ -> []
      end

    # 2. Hardcoded Backup (ensures Vercel always works even if config fails)
    static_origins = [
      "https://mzinga-delivery.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080"
    ]

    # Combine
    allowed_origins = static_origins ++ dynamic_origins

    # 3. Check Origin
    if is_nil(origin) do
      true
    else
      if origin in allowed_origins do
        true
      else
        Logger.warning("CORS Blocked Origin: #{inspect(origin)}")
        false
      end
    end
  rescue
    e ->
      Logger.error("CORS Check Crashing: #{inspect(e)}")
      false
  end
end
