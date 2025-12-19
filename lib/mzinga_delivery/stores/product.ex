defmodule MzingaDelivery.Stores.Product do
  use Ecto.Schema
  import Ecto.Changeset

  schema "products" do
    field :name, :string
    field :description, :string
    field :price, :decimal
    field :stock, :integer
    field :image_url, :string
    field :category, :string
    field :compare_at_price, :decimal
    field :ratings, {:array, :decimal}, default: []
    field :specifications, :map, default: %{}
    field :status, :string, default: "active"
    field :available, :boolean, default: true

    belongs_to :store, MzingaDelivery.Stores.Store
    has_many :order_items, MzingaDelivery.Orders.OrderItem

    timestamps()
  end

  @doc false
  def changeset(product, attrs) do
    product
    |> cast(attrs, [
      :store_id,
      :name,
      :description,
      :price,
      :stock,
      :image_url,
      :category,
      :compare_at_price,
      :ratings,
      :specifications,
      :status,
      :available
    ])
    |> validate_required([:store_id, :name, :price, :stock])
    |> validate_number(:price, greater_than: 0)
    |> validate_number(:stock, greater_than_or_equal_to: 0)
    |> validate_compare_at_price()
    |> validate_inclusion(:status, ["active", "inactive", "out_of_stock"])
    |> foreign_key_constraint(:store_id)
  end

  defp validate_compare_at_price(changeset) do
    price = get_field(changeset, :price)
    compare_at_price = get_field(changeset, :compare_at_price)

    if compare_at_price && price && Decimal.compare(compare_at_price, price) != :gt do
      add_error(changeset, :compare_at_price, "must be graeter than regular price")
    else
      changeset
    end
  end

  @doc """
  calculate average rating from ratings array
  """
  def average_rating(%__MODULE__{ratings: ratings})
      when is_list(ratings) and length(ratings) > 0 do
    sum = Enum.reduce(ratings, Decimal.new(0), &Decimal.add/2)
    count = Decimal.new(length(ratings))
    Decimal.div(sum, count) |> Decimal.round(1)
  end

  def average_rating(_), do: Decimal.new(0)
end
