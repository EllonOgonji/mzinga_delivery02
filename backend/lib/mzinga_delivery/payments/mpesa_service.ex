defmodule MzingaDelivery.Payments.MpesaService do
  @moduledoc """
  Handles M-Pesa Daraja API integration for STK Push payments.
  """

  require Logger

  # === Configuration Helpers ===
  # Fetch values from :mzinga_delivery, :mpesa in config/runtime.exs
  defp config(key),
    do: Application.fetch_env!(:mzinga_delivery, :mpesa) |> Keyword.fetch!(key)

  defp api_url, do: config(:api_url)
  defp shortcode, do: config(:shortcode)
  defp passkey, do: config(:passkey)
  defp consumer_key, do: config(:consumer_key)
  defp consumer_secret, do: config(:consumer_secret)
  defp callback_url, do: config(:callback_url)

  @doc """
  Initiates STK Push request to the customer's phone.
  Returns `{:ok, response}` or `{:error, reason}`.
  """
  def initiate_stk_push(phone_number, amount, order_id) do
    timestamp = get_timestamp()
    password = generate_password(timestamp)

    case validate_phone_number(phone_number) do
      {:error, _} = err ->
        Logger.error("Invalid phone number provided: #{inspect(phone_number)}")
        err

      {:ok, formatted_phone} ->
        payload = %{
          "BusinessShortCode" => shortcode(),
          "Password" => password,
          "Timestamp" => timestamp,
          "TransactionType" => "CustomerPayBillOnline",
          "Amount" => round(amount),
          "PartyA" => formatted_phone,
          "PartyB" => shortcode(),
          "PhoneNumber" => formatted_phone,
          "CallBackURL" => callback_url(),
          "AccountReference" => "Order#{order_id}",
          "TransactionDesc" => "Payment for Order ##{order_id}"
        }

        Logger.info(
          "Initiating STK Push for Order ##{order_id}, Amount: #{amount}, Phone: #{formatted_phone}"
        )

        headers = [
          {"Content-Type", "application/json"},
          {"Authorization", "Bearer #{get_access_token()}"}
        ]

        case HTTPoison.post(
               "#{api_url()}/mpesa/stkpush/v1/processrequest",
               Jason.encode!(payload),
               headers,
               timeout: 30_000,
               recv_timeout: 30_000
             ) do
          {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
            response = Jason.decode!(body)
            Logger.info("STK Push Response: #{inspect(response)}")
            {:ok, response}

          {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
            Logger.error("STK Push Failed - Status: #{status_code}, Body: #{body}")
            {:error, Jason.decode!(body)}

          {:error, %HTTPoison.Error{reason: reason}} ->
            Logger.error("STK Push HTTP Error: #{inspect(reason)}")
            {:error, reason}
        end
    end
  end

  @doc """
  Processes M-Pesa callback from the Daraja API.
  """
  def process_callback(callback_data) do
    Logger.info("Processing M-Pesa Callback: #{inspect(callback_data)}")

    case callback_data do
      %{"Body" => %{"stkCallback" => callback}} ->
        result_code = callback["ResultCode"]
        checkout_request_id = callback["CheckoutRequestID"]

        case result_code do
          0 ->
            # Payment successful
            callback_metadata = callback["CallbackMetadata"]["Item"]
            transaction_id = extract_metadata_value(callback_metadata, "MpesaReceiptNumber")
            amount = extract_metadata_value(callback_metadata, "Amount")
            phone = extract_metadata_value(callback_metadata, "PhoneNumber")

            Logger.info("Payment Successful - TxID: #{transaction_id}, Amount: #{amount}")

            {:ok,
             %{
               status: "completed",
               transaction_id: transaction_id,
               amount: amount,
               phone: phone,
               checkout_request_id: checkout_request_id
             }}

          _ ->
            # Payment failed
            result_desc = callback["ResultDesc"]
            Logger.error("Payment Failed - Code: #{result_code}, Desc: #{result_desc}")

            {:error,
             %{
               status: "failed",
               result_code: result_code,
               result_desc: result_desc,
               checkout_request_id: checkout_request_id
             }}
        end

      _ ->
        Logger.error("Invalid callback format: #{inspect(callback_data)}")
        {:error, :invalid_callback_format}
    end
  end


  defp get_access_token do
    auth = Base.encode64("#{consumer_key()}:#{consumer_secret()}")
    headers = [{"Authorization", "Basic #{auth}"}]

    case HTTPoison.get(
           "#{api_url()}/oauth/v1/generate?grant_type=client_credentials",
           headers,
           timeout: 30_000,
           recv_timeout: 30_000
         ) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        body |> Jason.decode!() |> Map.get("access_token")

      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        Logger.error("Failed to get access token - Status: #{status_code}, Body: #{body}")
        nil

      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error("Access token HTTP error: #{inspect(reason)}")
        nil
    end
  end

  defp generate_password(timestamp) do
    Base.encode64("#{shortcode()}#{passkey()}#{timestamp}")
  end

  defp get_timestamp do
    DateTime.utc_now() |> Calendar.strftime("%Y%m%d%H%M%S")
  end

  defp validate_phone_number(phone) do
    phone = String.replace(phone, ~r/\D/, "")

    cond do
      String.length(phone) < 9 ->
        {:error, :too_short}

      String.starts_with?(phone, "254") ->
        {:ok, phone}

      String.starts_with?(phone, "0") ->
        {:ok, "254" <> String.slice(phone, 1..-1)}

      true ->
        {:ok, "254" <> phone}
    end
  end

  defp extract_metadata_value(items, key) when is_list(items) do
    items
    |> Enum.find(fn item -> item["Name"] == key end)
    |> case do
      nil -> nil
      item -> item["Value"]
    end
  end
end
