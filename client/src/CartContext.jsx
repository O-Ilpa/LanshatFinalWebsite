import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

const CART_KEY = "quote_cart";

export function CartProvider({ children, user }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => {
      if (prev.find((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // For logged-in users, you can sync with backend here if needed

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
} 