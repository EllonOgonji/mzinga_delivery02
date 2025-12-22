defmodule MzingaDelivery.Payments do
  @moduledoc """
  The Payments context.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Payments.Payment

  @doc """
  Creates a payment record.
  """
  def create_payment(attrs \\ %{}) do
    %Payment{}
    |> Payment.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Gets payment by order_id.
  """
  def get_payment_by_order(order_id) do
    Repo.get_by(Payment, order_id: order_id)
  end

  @doc """
  Gets payment by transaction_id.
  """
  def get_payment_by_transaction(transaction_id) do
    Repo.get_by(Payment, transaction_id: transaction_id)
  end

  @doc """
  Updates a payment.
  """
  def update_payment(%Payment{} = payment, attrs) do
    payment
    |> Payment.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates payment status.
  """
  def update_payment_status(%Payment{} = payment, status) do
    update_payment(payment, %{status: status})
  end
end
