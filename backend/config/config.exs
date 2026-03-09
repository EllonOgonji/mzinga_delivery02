# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

# Load .env variables if present (for development)
if File.exists?(".env") do
  File.read!(".env")
  |> String.split("\n", trim: true)
  |> Enum.each(fn line ->
    case String.split(line, "=", parts: 2) do
      [key, value] when key != "" ->
        # Only set if not already set, or overwrite?
        # Usually for dev we want .env to win or be the source if not in shell.
        # Let's just put it.
        key = String.trim(key)
        value = String.trim(value, ~s("'))
        System.put_env(key, value)

      _ ->
        :skip
    end
  end)
end

config :mzinga_delivery, MzingaDelivery.Auth.Guardian,
  issuer: "mzinga_delivery",
  secret_key: System.get_env("GUARDIAN_SECRET_KEY")

config :mzinga_delivery,
  ecto_repos: [MzingaDelivery.Repo],
  generators: [timestamp_type: :utc_datetime, binary_id: true]

# Configures the endpoint
config :mzinga_delivery, MzingaDeliveryWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: MzingaDeliveryWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: MzingaDelivery.PubSub,
  live_view: [signing_salt: "UmgxKH+5"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :mzinga_delivery, MzingaDelivery.Mailer, adapter: Swoosh.Adapters.Local

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configures Delivery variables
config :mzinga_delivery, :delivery,
  google_maps_api_key: System.get_env("GOOGLE_MAPS_API_KEY", "PLACEHOLDER_KEY"),
  fuel_rate_per_km: String.to_integer(System.get_env("DELIVERY_FUEL_RATE", "15")),
  maintenance_rate_per_km: String.to_integer(System.get_env("DELIVERY_MAINTENANCE_RATE", "5")),
  rider_pay_per_km: String.to_integer(System.get_env("DELIVERY_RIDER_PAY", "20"))

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"

# Frontend URL for password reset emails
config :mzinga_delivery,
  frontend_url: System.get_env("FRONTEND_URL", "https://mzinga-delivery.vercel.app")

# Default CORS settings (development-friendly). Override in runtime.exs
config :cors_plug,
  origin: [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://mzinga-delivery.vercel.app"
  ],
  max_age: 86_400,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  headers: ["authorization", "content-type", "accept"],
  expose: ["authorization"],
  credentials: true
