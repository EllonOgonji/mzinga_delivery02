import Config

# Configures Swoosh API Client
config :swoosh, api_client: Swoosh.ApiClient.Finch, finch_name: MzingaDelivery.Finch

# Disable Swoosh Local Memory Storage
config :swoosh, local: false

# Use Logger adapter for emails in production (logs email content instead of sending)
# Replace with a real adapter (e.g., Swoosh.Adapters.Mailgun) when ready
config :mzinga_delivery, MzingaDelivery.Mailer, adapter: Swoosh.Adapters.Logger

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.
