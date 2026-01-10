defmodule MzingaDeliveryWeb.CORSVerificationTest do
  use ExUnit.Case
  alias MzingaDeliveryWeb.CORS
  alias Plug.Conn

  test "allow? handles string origins correctly" do
    assert CORS.allow?("https://mzinga-delivery.vercel.app") == true
    assert CORS.allow?("http://localhost:8080") == true
    assert CORS.allow?("http://evil.com") == false
  end

  test "allow? handles Plug.Conn struct correctly (The Fix)" do
    # Simulate what CORSPlug passes: a Conn with the origin header
    conn =
      Conn.new()
      |> Conn.put_req_header("origin", "https://mzinga-delivery.vercel.app")

    assert CORS.allow?(conn) == true

    conn_evil =
      Conn.new()
      |> Conn.put_req_header("origin", "http://evil.com")

    assert CORS.allow?(conn_evil) == false
  end

  test "allow? handles Plug.Conn without origin (e.g. server-to-server)" do
    conn = Conn.new()
    assert CORS.allow?(conn) == true
  end
end
