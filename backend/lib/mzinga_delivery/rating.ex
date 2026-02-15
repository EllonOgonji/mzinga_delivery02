defmodule MzingaDelivery.Rating do
  @moduledoc """
  The Rating context.
  """

  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Rating.Review
  alias MzingaDelivery.Orders

  @doc """
  Creates a review.
  Ensures the order is 'delivered' before allowing creation.
  """
  def create_review(attrs \\ %{}) do
    order_id = attrs["order_id"] || attrs[:order_id]

    case Orders.get_order(order_id) do
      nil ->
        {:error, :order_not_found}

      order ->
        if order.delivery_status == "delivered" do
          # Pre-fill rider and customer from order if not provided (safety)
          # But usually we trust the attrs if validated by controller/policy.
          # Let's enforce linkage to order details for integrity.

          final_attrs =
            Map.merge(attrs, %{
              "customer_id" => order.customer_id,
              "rider_id" => order.rider_id
            })

          %Review{}
          |> Review.changeset(final_attrs)
          |> Repo.insert()
        else
          {:error, :order_not_delivered}
        end
    end
  end

  @doc """
  Gets reviews for a rider.
  """
  def list_rider_reviews(rider_id) do
    Review
    |> where([r], r.rider_id == ^rider_id)
    |> Repo.all()
  end

  def get_review!(id), do: Repo.get!(Review, id)
end
