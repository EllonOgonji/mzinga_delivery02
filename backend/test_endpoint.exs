defmodule EndpointTest do
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Stores.Product
  alias MzingaDeliveryWeb.ProductJSON
  
  def run do
    # Just grab a product to see how the JSON renders
    product = Repo.all(Product) |> List.first() |> Repo.preload(:store)
    if product do
      json = ProductJSON.index(%{products: [product]})
      IO.inspect(json)
    end
  end
end

EndpointTest.run()
