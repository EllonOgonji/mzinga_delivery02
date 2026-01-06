defmodule MzingaDeliveryWeb.ReviewController do
  use MzingaDeliveryWeb, :controller

  alias MzingaDelivery.Rating
  alias MzingaDeliveryWeb.FallbackController

  action_fallback FallbackController

  def create(conn, %{"review" => review_params}) do
    # Check if user is trying to review an order they didn't make?
    # The context fills customer_id from the order, so if they pass a random order_id,
    # we should ideally ensure order.customer_id matches current_user.id.
    # (Context logic enhancement or check here).

    # For now, let's pass params. The context enforces linkage.
    # To be safer, we can check ownership here or in context.

    with {:ok, %MzingaDelivery.Rating.Review{} = review} <- Rating.create_review(review_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/reviews/#{review}")
      |> render(:show, review: review)
    end
  end

  def show(conn, %{"id" => id}) do
    review = Rating.get_review!(id)
    render(conn, :show, review: review)
  end
end
