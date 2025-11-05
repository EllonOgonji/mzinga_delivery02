defmodule MzingaDelivery.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      MzingaDeliveryWeb.Telemetry,
      MzingaDelivery.Repo,
      {DNSCluster, query: Application.get_env(:mzinga_delivery, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: MzingaDelivery.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: MzingaDelivery.Finch},
      # Start a worker by calling: MzingaDelivery.Worker.start_link(arg)
      # {MzingaDelivery.Worker, arg},
      # Start to serve requests, typically the last entry
      MzingaDeliveryWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: MzingaDelivery.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    MzingaDeliveryWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
