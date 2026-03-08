import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: MzingaDelivery.Finch

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Use Brevo (formerly Sendinblue) for sending transactional emails in production
# Set BREVO_API_KEY env var on Render with your Brevo v3 API key
config :mzinga_delivery, MzingaDelivery.Mailer,
  adapter: Swoosh.Adapters.Brevo,
  api_key: System.get_env("BREVO_API_KEY")

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
