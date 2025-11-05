import Config
#alias Dotenvy.Parser
# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.
if File.exists?(".env") do
  IO.puts("Loading .env variables...")

  File.read!(".env")
  |> String.split("\n", trim: true)
  |> Enum.each(fn line ->
    case String.split(line, "=", parts: 2) do
      [key, value] when key != "" ->
        System.put_env(String.trim(key), String.trim(value, ~s("')))
      _ ->
        :skip
    end
  end)
end
# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/mzinga_delivery start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.
if System.get_env("PHX_SERVER") do
  config :mzinga_delivery, MzingaDeliveryWeb.Endpoint, server: true
end

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  maybe_ipv6 = if System.get_env("ECTO_IPV6") in ~w(true 1), do: [:inet6], else: []

  config :mzinga_delivery, MzingaDelivery.Repo,
    # ssl: true,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6

  # The secret key base is used to sign/encrypt cookies and other secrets.
  # A default value is used in config/dev.exs and config/test.exs but you
  # want to use a different value for prod and you most likely don't want
  # to check this value into version control, so we use an environment
  # variable instead.
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :mzinga_delivery, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :mzinga_delivery, MzingaDeliveryWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      # Enable IPv6 and bind on all interfaces.
      # Set it to  {0, 0, 0, 0, 0, 0, 0, 1} for local network only access.
      # See the documentation on https://hexdocs.pm/bandit/Bandit.html#t:options/0
      # for details about using IPv6 vs IPv4 and loopback vs public addresses.
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base

    #Mpesa config
    config :mzinga_delivery, :mpesa,
    api_url: System.get_env("MPESA_API_URL") || raise("MPESA_API_URL not set"),
    shortcode: System.get_env("MPESA_SHORTCODE") || raise("MPESA_SHORTCODE not set"),
    passkey: System.get_env("MPESA_PASSKEY") || raise("MPESA_PASSKEY not set"),
    consumer_key: System.get_env("MPESA_CONSUMER_KEY") || raise("MPESA_CONSUMER_KEY not set"),
    consumer_secret: System.get_env("MPESA_CONSUMER_SECRET") || raise("MPESA_CONSUMER_SECRET not set"),
    callback_url: System.get_env("MPESA_CALLBACK_URL") || raise("MPESA_CALLBACK_URL not set")

else
  # DEVELOPMENT/TEST CONFIGURATION

  config :mzinga_delivery, :mpesa,
    api_url: "https://sandbox.safaricom.co.ke",
    shortcode: "174379",
    passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
    consumer_key: System.get_env("MPESA_CONSUMER_KEY", "eUcoSqN08wAAmEP0k31rosEfqgRWyggtbv629w4kpRzRPiTe"),
    consumer_secret: System.get_env("MPESA_CONSUMER_SECRET", "B54U4HCWGHFQHEkAERUwh73SnsnKGIxMH308FpGvcwuYpCAWXrG5WOQSL1Mh3aXq"),
    callback_url: System.get_env("MPESA_CALLBACK_URL", "https://lordless-tama-equally.ngrok-free.dev/api/payments/callback")

  # ## SSL Support
  #
  # To get SSL working, you will need to add the `https` key
  # to your endpoint configuration:
  #
  #     config :mzinga_delivery, MzingaDeliveryWeb.Endpoint,
  #       https: [
  #         ...,
  #         port: 443,
  #         cipher_suite: :strong,
  #         keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
  #         certfile: System.get_env("SOME_APP_SSL_CERT_PATH")
  #       ]
  #
  # The `cipher_suite` is set to `:strong` to support only the
  # latest and more secure SSL ciphers. This means old browsers
  # and clients may not be supported. You can set it to
  # `:compatible` for wider support.
  #
  # `:keyfile` and `:certfile` expect an absolute path to the key
  # and cert in disk or a relative path inside priv, for example
  # "priv/ssl/server.key". For all supported SSL configuration
  # options, see https://hexdocs.pm/plug/Plug.SSL.html#configure/1
  #
  # We also recommend setting `force_ssl` in your config/prod.exs,
  # ensuring no data is ever sent via http, always redirecting to https:
  #
  #     config :mzinga_delivery, MzingaDeliveryWeb.Endpoint,
  #       force_ssl: [hsts: true]
  #
  # Check `Plug.SSL` for all available options in `force_ssl`.

  # ## Configuring the mailer
  #
  # In production you need to configure the mailer to use a different adapter.
  # Also, you may need to configure the Swoosh API client of your choice if you
  # are not using SMTP. Here is an example of the configuration:
  #
  #     config :mzinga_delivery, MzingaDelivery.Mailer,
  #       adapter: Swoosh.Adapters.Mailgun,
  #       api_key: System.get_env("MAILGUN_API_KEY"),
  #       domain: System.get_env("MAILGUN_DOMAIN")
  #
  # For this example you need include a HTTP client required by Swoosh API client.
  # Swoosh supports Hackney and Finch out of the box:
  #
  #     config :swoosh, :api_client, Swoosh.ApiClient.Hackney
  #
  # See https://hexdocs.pm/swoosh/Swoosh.html#module-installation for details.
end
