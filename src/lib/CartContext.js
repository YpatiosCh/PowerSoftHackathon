"use client";

import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({});

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: {
            ...existing,
            quantity: existing.quantity + 1,
          },
        };
      }
      return {
        ...prev,
        [item.id]: {
          ...item,
          quantity: 1,
        },
      };
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  }, []);

  const clearItem = useCallback((itemId) => {
    setItems((prev) => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems({});
  }, []);

  const getItemQuantity = useCallback((itemId) => {
    return items[itemId]?.quantity || 0;
  }, [items]);

  const cartItems = Object.values(items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.price || item.pricing?.bottle || item.pricing?.glass || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        clearItem,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
