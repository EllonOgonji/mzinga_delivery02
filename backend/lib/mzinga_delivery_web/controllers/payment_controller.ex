defmodule MzingaDeliveryWeb.PaymentController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Payments
  alias MzingaDelivery.Payments.MpesaService
  alias MzingaDelivery.Orders

  require Logger

  @doc """
  M-pesa callback endpoint
  POST /api/payments/callback
  this endpoint receives payment confirmation
  """

  def mpesa_callback(conn, params) do
    Logger.info("=" <> String.duplicate("=", 60))
    Logger.info("M-Pesa Callback Received")
    Logger.info("=" <> String.duplicate("=", 60))
    Logger.info("Callback params: #{inspect(params, pretty: true)}")

    case MpesaService.process_callback(params) do
      {:ok, payment_data} ->
        Logger.info("Payment Successful: #{inspect(payment_data)}")

        # update payment status
        handle_successful_payment(payment_data)

        # respond to M-Pesa API (must be 200 OK)
        conn
        |> put_status(:ok)
        |> json(%{
          "ResultCode" => 0,
          "ResultDesc" => "Accepted"
        })

      {:error, error_data} ->
        Logger.error("Payment Failed: #{inspect(error_data)}")

        # log failed payment
        handle_failed_payment(error_data)

        conn
        |> put_status(:ok)
        |> json(%{
          "ResultCode" => 0,
          "ResultDesc" => "Accepted"
        })
    end
  end

  # handle successful payment
  defp handle_successful_payment(%{transaction_id: transaction_id, checkout_request_id: checkout_request_id} = payment_data) do
    Logger.info("Processing successful payment: TxID=#{transaction_id}")

    # find payment record by checkout_request_id
    case Payments.get_payment_by_transaction(checkout_request_id) do
      nil ->
        Logger.warning("Payment record not found for CheckoutRequestID: #{checkout_request_id}")
        Logger.info("Searching by MpesaReceiptNumber: #{transaction_id}")

        # try to find mpesa receipt number
        case Payments.get_payment_by_transaction(transaction_id) do
          nil ->
            Logger.error("Cannot find payment record for transaction")

          payment ->
            update_payment_and_order(payment, transaction_id, payment_data)
        end

      payment ->
        Logger.info("Payment record found: #{payment.id}")
        update_payment_and_order(payment, transaction_id, payment_data)
    end
  end

  # update payment and order status
  defp update_payment_and_order(payment, transaction_id, payment_data) do
    case Payments.update_payment(payment, %{
      status: "completed",
      transaction_id: transaction_id
    }) do
      {:ok, updated_payment} ->
        Logger.info("Payment #{updated_payment.id} marked as completed")

        # update payment status
        case Orders.get_order(payment.order_id) do
          nil ->
            Logger.error("Order #{payment.order_id} not found")

          order ->
            case Orders.update_payment_status(order, "paid") do
              {:ok, updated_order} ->
                Logger.info("Order #{updated_order.id} marked as paid")
                broadcast_payment_success(order, transaction_id, payment_data)

              {:error, changeset} ->
                Logger.error("Failed to update order payment status: #{inspect(changeset.errors)}")
            end
        end

      {:error, changeset} ->
        Logger.error("Failed to update payment: #{inspect(changeset.errors)}")
    end
  end

  # broadcast payment success notification
  defp broadcast_payment_success(order, transaction_id, payment_data) do
    MzingaDeliveryWeb.Endpoint.broadcast(
      "notifications:customer_#{order.customer.id}",
      "payment_completed",
      %{
        order_id: order.id,
        transaction_id: transaction_id,
        amount: payment_data.amount,
        message: "Payment completed successfully!",
        timestamp: DateTime.utc_now()
      }
    )

    # save notification to database
    MzingaDelivery.Notifications.create_notification(%{
      user_id: order.customer.id,
      message: "Payment of KES #{payment_data.amount} received for order ##{order.id}. Receipt: #{transaction_id}",
      type: "payment_completed"
    })

    Logger.info("Payment notification sent to customer #{order.customer_id}")
  end

  # handle failed payment
  defp handle_failed_payment(%{checkout_request_id: checkout_request_id} = error_data) do
    Logger.error("Processing failed payment: #{inspect(error_data)}")

    result_desc = error_data[:result_desc] || "Payment failed"

    case Payments.get_payment_by_transaction(checkout_request_id) do
      nil ->
        Logger.warning("Payment record not found for failed transaction: #{checkout_request_id}")

      payment ->
        case Payments.update_payment(payment, %{status: "failed"}) do
          {:ok, _updated_payment} ->
            Logger.info("Payment #{payment.id} marked as failed")

            # Update order payment status
            case Orders.get_order(payment.order_id) do
              nil ->
                Logger.error("Order #{payment.order_id} not found")

              order ->
                Orders.update_payment_status(order, "failed")

                # Notify customer about failed payment
                MzingaDeliveryWeb.Endpoint.broadcast(
                  "notifications:customer_#{order.customer_id}",
                  "payment_failed",
                  %{
                    order_id: order.id,
                    message: "Payment failed: #{result_desc}",
                    timestamp: DateTime.utc_now()
                  }
                )

                Logger.info("Payment failure notification sent to customer #{order.customer_id}")
            end

          {:error, changeset} ->
            Logger.error("Failed to update payment status: #{inspect(changeset.errors)}")
        end
    end
  end
end
