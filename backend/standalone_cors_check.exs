# Mocking Plug.Conn to avoid dependency issues in standalone script
defmodule Plug.Conn do
  defstruct req_headers: []

  def get_req_header(conn, key) do
    # Simple mock implementation
    Enum.find_value(conn.req_headers, [], fn {k, v} ->
      if String.downcase(k) == String.downcase(key), do: [v], else: nil
    end) || []
  end
end

defmodule MzingaDeliveryWeb.CORS do
  require Logger

  # EXACT CODE FROM lib/mzinga_delivery_web/cors.ex
  def allow?(%Plug.Conn{} = conn) do
    # CORSPlug passes the conn, so we extract the origin header
    case Plug.Conn.get_req_header(conn, "origin") do
      [origin | _] -> allow?(origin)
      # Allow requests with no origin (non-browser)
      [] -> true
    end
  end

  def allow?(origin) do
    # 1. Get Dynamic Config (safely) - MOCKED for standalone
    dynamic_origins = []

    # 2. Hardcoded Backup
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
        IO.puts("CORS Blocked Origin: #{inspect(origin)}")
        false
      end
    end
  rescue
    e ->
      IO.puts("CORS Check Crashing: #{inspect(e)}")
      false
  end
end

# VERIFICATION
IO.puts("--- Starting Verification ---")

# 1. String Origins
if MzingaDeliveryWeb.CORS.allow?("https://mzinga-delivery.vercel.app") do
  IO.puts("PASS: Vercel String Allowed")
else
  IO.puts("FAIL: Vercel String Blocked")
end

if MzingaDeliveryWeb.CORS.allow?("http://localhost:8080") do
  IO.puts("PASS: Localhost 8080 String Allowed")
else
  IO.puts("FAIL: Localhost 8080 String Blocked")
end

# 2. Plug.Conn (The Fix)
conn_vercel = %{
  __struct__: Plug.Conn,
  req_headers: [{"origin", "https://mzinga-delivery.vercel.app"}]
}

if MzingaDeliveryWeb.CORS.allow?(conn_vercel) do
  IO.puts("PASS: Vercel Plug.Conn Allowed")
else
  # Debug
  IO.puts("FAIL: Vercel Plug.Conn Blocked")
end

conn_8080 = %{__struct__: Plug.Conn, req_headers: [{"origin", "http://localhost:8080"}]}

if MzingaDeliveryWeb.CORS.allow?(conn_8080) do
  IO.puts("PASS: Localhost 8080 Plug.Conn Allowed")
else
  IO.puts("FAIL: Localhost 8080 Plug.Conn Blocked")
end

IO.puts("--- Verification Complete ---")
