defmodule API_Tester do
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Accounts.User
  
  def run do
    # Get any valid customer
    customer = Repo.get_by(User, email: "chapo@example.com") || List.first(Repo.all(User))
    
    if customer do
      IO.puts("Testing as #{customer.email}")
      token = MzingaDelivery.Auth.Guardian.encode_and_sign(customer) |> elem(1)
      
      # Clear cart first
      System.cmd("bash", ["-c", "curl -s -X DELETE http://localhost:4000/api/cart -H 'Authorization: Bearer #{token}'"])

      # Add to cart
      req = "curl -s -i -X POST http://localhost:4000/api/cart/items -H 'Content-Type: application/json' -H 'Authorization: Bearer #{token}' -d '{\"product_id\": 7, \"quantity\": 1}'"
      IO.inspect(System.cmd("bash", ["-c", req]))
      
      # Checkout
      check_req = "curl -s -i -X POST http://localhost:4000/api/checkout -H 'Content-Type: application/json' -H 'Authorization: Bearer #{token}' -d '{\"payment_phone\": \"254700000000\"}'"
      IO.inspect(System.cmd("bash", ["-c", check_req]))
    end
  end
end

API_Tester.run()
