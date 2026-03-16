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

  @doc """
  Retry a failed payment
  POST /api/payments/retry
  """
  def retry(conn, params) do
    user = MzingaDelivery.Auth.Guardian.Plug.current_resource(conn)
    payment_phone = params["payment_phone"]

    case Orders.retry_payment(user, payment_phone, params) do
      {:ok, result} ->
        conn
        |> put_status(:ok)
        |> json(%{
          status: "success",
          message: "Payment retry initiated",
          data: result
        })

      {:error, :payment_not_found} ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Payment record not found"})

      {:error, :invalid_payment_status} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Payment cannot be retried (status must be pending or failed)"})

      {:error, :unauthorized} ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "You are not authorized to retry this payment"})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "Failed to initiate retry: #{inspect(reason)}"})
    end
  end

  # handle successful payment
  defp handle_successful_payment(
         %{transaction_id: transaction_id, checkout_request_id: checkout_request_id} =
           payment_data
       ) do
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

        if updated_payment.checkout_group_id do
          # Unified Checkout Flow
          group_id = updated_payment.checkout_group_id
          {count, _} = Orders.update_group_orders_payment_status(group_id, "paid")
          Logger.info("#{count} orders in group #{group_id} marked as paid")

          # Get one order for notification details
          orders = Orders.get_orders_by_group(group_id)

          if List.first(orders) do
            broadcast_payment_success(List.first(orders), transaction_id, payment_data)
            # Notify ALL vendors in this group
            Enum.each(orders, &notify_vendor_on_payment/1)
          end
        else
          # Single Order Flow
          case Orders.get_order(payment.order_id) do
            nil ->
              Logger.error("Order #{payment.order_id} not found")

            order ->
              case Orders.update_payment_status(order, "paid") do
                {:ok, updated_order} ->
                  Logger.info("Order #{updated_order.id} marked as paid")
                  broadcast_payment_success(order, transaction_id, payment_data)
                  notify_vendor_on_payment(order)

                {:error, changeset} ->
                  Logger.error(
                    "Failed to update order payment status: #{inspect(changeset.errors)}"
                  )
              end
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
      message:
        "Payment of KES #{payment_data.amount} received for order ##{order.id}. Receipt: #{transaction_id}",
      type: "payment_completed"
    })

    Logger.info("Payment notification sent to customer #{order.customer_id}")
  end

  defp notify_vendor_on_payment(order) do
    # Ensure items and products are preloaded
    order = MzingaDelivery.Repo.preload(order, [:customer, :order_items, store: :vendor])

    # Broadcast to store owner via WebSocket
    MzingaDeliveryWeb.Endpoint.broadcast(
      "notifications:store_#{order.store_id}",
      "new_order",
      %{
        order_id: order.id,
        customer_name: order.customer.full_name,
        customer_phone: order.customer.phone_number,
        total: Decimal.to_float(order.total_price),
        items_count: length(order.order_items),
        timestamp: DateTime.utc_now()
      }
    )

    # Save notification to database for vendor
    MzingaDelivery.Notifications.create_notification(%{
      user_id: order.store.vendor_id,
      message:
        "New paid order ##{order.id} from #{order.customer.full_name} - KES #{Decimal.to_float(order.total_price)}",
      type: "new_order"
    })

    Logger.info("Notification sent to vendor #{order.store.vendor_id} for order #{order.id}")
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

            if payment.checkout_group_id do
              # Unified Checkout Flow
              group_id = payment.checkout_group_id
              Orders.update_group_orders_payment_status(group_id, "failed")

              # Broadcast failure (using one order for customer id)
              orders = Orders.get_orders_by_group(group_id)

              if order = List.first(orders) do
                MzingaDeliveryWeb.Endpoint.broadcast(
                  "notifications:customer_#{order.customer_id}",
                  "payment_failed",
                  %{
                    order_id: nil,
                    checkout_group_id: group_id,
                    message: "Payment failed for group order: #{result_desc}",
                    timestamp: DateTime.utc_now()
                  }
                )
              end
            else
              # Single Order Flow
              case Orders.get_order(payment.order_id) do
                nil ->
                  Logger.error("Order #{payment.order_id} not found")

                order ->
                  Orders.update_payment_status(order, "failed")

                  # Notify customer about failed payment via WebSocket
                  MzingaDeliveryWeb.Endpoint.broadcast(
                    "notifications:customer_#{order.customer_id}",
                    "payment_failed",
                    %{
                      order_id: order.id,
                      message: "Payment failed: #{result_desc}",
                      timestamp: DateTime.utc_now()
                    }
                  )

                  # Save notification to database for history
                  MzingaDelivery.Notifications.create_notification(%{
                    user_id: order.customer_id,
                    message:
                      "Payment failed for order ##{order.id}: #{result_desc}. You can retry payment.",
                    type: "payment_failed"
                  })

                  Logger.info(
                    "Payment failure notification sent to customer #{order.customer_id}"
                  )
              end
            end

          {:error, changeset} ->
            Logger.error("Failed to update payment status: #{inspect(changeset.errors)}")
        end
    end
  end
end
