/**
 * CognoRise InfoTech Web Development Internship — Task 2
 * Custom Hook: useCart
 * Encapsulates shopping cart state, LocalStorage persistence,
 * quantity mutation, removal, and defensive error handling.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cognorise_ecommerce_cart';

export function useCart() {
  // Initialize cart from LocalStorage safely
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Validate that parsed data is an array of valid item objects
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && typeof item.id !== 'undefined' && typeof item.price === 'number');
      }
      return [];
    } catch (err) {
      console.warn('Failed to parse cart from LocalStorage, falling back to empty cart:', err);
      return [];
    }
  });

  // Persist cart to LocalStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to LocalStorage:', err);
    }
  }, [cart]);

  // Add product to cart (prevent duplicate; update quantity if already present)
  const addToCart = (product) => {
    if (!product || typeof product.id === 'undefined') return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingIndex > -1) {
        // Product exists: update quantity
        return prevCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // New product: insert with quantity 1
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          quantity: 1
        }
      ];
    });
  };

  // Update quantity with strict bounds (quantity cannot go below 1)
  const updateQuantity = (productId, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const nextQty = item.quantity + delta;
          // Guard: quantity cannot go below 1; use removeFromCart instead
          return {
            ...item,
            quantity: nextQty >= 1 ? nextQty : 1
          };
        }
        return item;
      })
    );
  };

  // Remove a product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Clear all products from cart
  const clearCart = () => {
    setCart([]);
  };

  // Derived state calculations
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice
  };
}
