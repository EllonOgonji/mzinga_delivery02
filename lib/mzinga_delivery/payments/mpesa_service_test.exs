defmodule MzingaDelivery.Payments.MpesaServiceTest do
  use ExUnit.Case
  alias MzingaDelivery.Payments.MpesaService

  describe "phone number formatting" do
    test "formats phone with leading 0" do
      # Use a public function or make format_phone_number public for testing
      assert MzingaDelivery.Payments.MpesaService.format_phone_number("0712345678") == "254712345678"
    end
  end
end
