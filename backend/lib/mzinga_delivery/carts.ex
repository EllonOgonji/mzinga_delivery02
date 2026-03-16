defmodule MzingaDelivery.Carts do
  @moduledoc """
  Context for managing shopping carts.
  """
  import Ecto.Query, warn: false
  alias MzingaDelivery.Repo
  alias MzingaDelivery.Carts.{Cart, CartItem}
  alias MzingaDelivery.Stores

  def get_cart(user_id) do
    Cart
    |> where([c], c.user_id == ^user_id)
    |> preload(items: :product)
    |> Repo.one()
  end

  def get_or_create_cart(user_id, store_id) do
    case get_cart(user_id) do
      nil ->
        %Cart{}
        |> Cart.changeset(%{user_id: user_id, store_id: store_id})
        |> Repo.insert()

      cart ->
        {:ok, cart}
    end
  end

  def add_item(user_id, product_id, quantity) do
    # Correctly handle the tuple return from get_product!
    case Stores.get_product!(product_id) do
      {:error, _} ->
        {:error, :product_not_found}

      {:ok, product} ->
        if product.stock < quantity do
          {:error, :out_of_stock}
        else
          Repo.transaction(fn ->
            # 1. Get or Create Cart
            # Logic: If cart exists but different store -> Error
            cart = get_cart(user_id)

            cart =
              case cart do
                nil ->
                  {:ok, new_cart} = get_or_create_cart(user_id, product.store_id)
                  new_cart

                %Cart{} = existing_cart ->
                  existing_cart
              end

            # 2. Add or Update Item
            existing_item = Repo.get_by(CartItem, cart_id: cart.id, product_id: product_id)

            subtotal = Decimal.mult(product.price, Decimal.new(quantity))

            item_result =
              case existing_item do
                nil ->
                  %CartItem{}
                  |> CartItem.changeset(%{
                    cart_id: cart.id,
                    product_id: product_id,
                    quantity: quantity,
                    unit_price: product.price,
                    subtotal: subtotal
                  })
                  |> Repo.insert()

                item ->
                  new_qty = quantity
                  new_subtotal = Decimal.mult(product.price, Decimal.new(new_qty))

                  item
                  |> CartItem.changeset(%{
                    quantity: new_qty,
                    subtotal: new_subtotal
                  })
                  |> Repo.update()
              end

            # 3. Update Cart Total
            update_cart_total(cart.id)

            case item_result do
              {:ok, item} -> item
              {:error, cs} -> Repo.rollback(cs)
            end
          end)
        end
    end
  end

  def remove_item(user_id, product_id) do
    cart = get_cart(user_id)

    if cart do
      item = Repo.get_by(CartItem, cart_id: cart.id, product_id: product_id)

      if item do
        Repo.delete(item)
        update_cart_total(cart.id)
      else
        {:error, :not_found}
      end
    else
      {:error, :cart_not_found}
    end
  end

  def clear_cart(user_id) do
    case get_cart(user_id) do
      nil -> {:ok, :no_cart}
      # Cascades to items
      cart -> Repo.delete(cart)
    end
  end

  defp update_cart_total(cart_id) do
    query = from i in CartItem, where: i.cart_id == ^cart_id, select: sum(i.subtotal)
    total = Repo.one(query) || Decimal.new(0)

    Repo.get(Cart, cart_id)
    |> Cart.changeset(%{total_price: total})
    |> Repo.update!()
  end
end
