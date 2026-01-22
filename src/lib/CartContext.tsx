'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (item: any) => void
  removeItem: (itemId: string) => void
  clearItem: (itemId: string) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
  // Legacy methods for backwards compatibility
  cart: CartItem[]
  addToCart: (item: any) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [itemsMap, setItemsMap] = useState<Record<string, CartItem>>({})

  const addItem = useCallback((item: any) => {
    setItemsMap((prev) => {
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
        } as CartItem,
      };
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItemsMap((prev) => {
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

  const clearItem = useCallback((itemId: string) => {
    setItemsMap((prev) => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItemsMap({});
  }, []);

  const getItemQuantity = useCallback((itemId: string) => {
    return itemsMap[itemId]?.quantity || 0;
  }, [itemsMap]);

  const items = Object.values(itemsMap);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.finalPrice || item.price || item.pricing?.bottle || item.pricing?.glass || 0;
    return sum + price * item.quantity;
  }, 0);

  // Legacy methods for backwards compatibility
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      clearItem(itemId);
      return;
    }
    
    setItemsMap(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity
        }
      };
    });
  }, [clearItem]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        clearItem,
        clearCart,
        getItemQuantity,
        // Legacy compatibility
        cart: items,
        addToCart: addItem,
        removeFromCart: clearItem,
        updateQuantity,
        getTotalItems: () => totalItems,
        getTotalPrice: () => totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
