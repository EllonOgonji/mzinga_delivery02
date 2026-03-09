import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ReturnData } from '@/types';
import { toast } from 'sonner';
import { addItemToCart } from '@/data/orderData';
import { fetchCart, updateCartItem, removeItemFromCart, clearCartItems } from '@/data/orderData';
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => Promise<ReturnData>;
  cartTotal: number;
  cartCount: number;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!(user?.id && token));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  // Listen for storage changes (e.g. after login)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!(user?.id && token));
      } catch {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const {data: cart = [], isLoading: isCartLoading } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const {status, data, error} = await fetchCart()

      if(!status){
        return []
      }

      return data ? data.items : []
    },
    enabled: isLoggedIn,
    retry: false,
  })

  const addToCart = async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const {status, data, error} = await addItemToCart({
      id: item.id,
      quantity: quantity
    })

    if(!status){
      toast.error("Failed to add item to cart. Please try again")
      return
    }

    toast.success("Item added to cart")

    queryClient.invalidateQueries({ queryKey: ['cart'] });   

    return
  };

  const removeFromCart = async (productId: number) => {
    const {status, data, error} = await removeItemFromCart(productId)

    if(!status){
      toast.error("Failed to add item to cart. Please try again")
      return
    }

    toast.success("Item removed from cart successfully")

    queryClient.invalidateQueries({ queryKey: ['cart'] });   

    return
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const {status, data, error} = await addItemToCart({
      id: productId,
      quantity: quantity
    })

    if(!status){
      toast.error("Failed to update cart item. Please try again")
      return
    }

    toast.success("Cart item updated")

    queryClient.invalidateQueries({ queryKey: ['cart'] });   
    return
  };

  const clearCart = async (): Promise<ReturnData> => {
    const {status, data, error} = await clearCartItems()

    if(!status){
      toast.error("Failed to clear cart. Please try again")
      return
    }

    toast.success("Cart cleared successfully")

    queryClient.invalidateQueries({ queryKey: ['cart'] });   

    return
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
