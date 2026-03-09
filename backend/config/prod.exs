import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: MzingaDelivery.Finch

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Use Brevo (formerly Sendinblue) for sending transactional emails in production
config :mzinga_delivery, MzingaDelivery.Mailer, adapter: Swoosh.Adapters.Brevo

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
