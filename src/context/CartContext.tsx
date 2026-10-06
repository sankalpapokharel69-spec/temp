import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Template } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (template: Template) => boolean;
  removeFromCart: (templateId: string) => void;
  clearCart: () => void;
  isInCart: (templateId: string) => boolean;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const cartStorageKey = user ? `webcraft_cart_${user.id}` : 'webcraft_cart_guest';

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(cartStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Sync cart when user switches
  useEffect(() => {
    try {
      const key = user ? `webcraft_cart_${user.id}` : 'webcraft_cart_guest';
      const saved = localStorage.getItem(key);
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
  }, [user]);

  // Save on state change
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  const addToCart = (template: Template): boolean => {
    if (cart.some(item => item.template.id === template.id)) {
      return false; // Already in cart
    }
    setCart(prev => [...prev, { template, addedAt: Date.now() }]);
    return true;
  };

  const removeFromCart = (templateId: string) => {
    setCart(prev => prev.filter(item => item.template.id !== templateId));
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
    localStorage.removeItem(cartStorageKey);
  };

  const isInCart = (templateId: string) => {
    return cart.some(item => item.template.id === templateId);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WEBCRAFT10') {
      setPromoCode('WEBCRAFT10');
      setDiscountPercent(10);
      return true;
    }
    if (clean === 'FIRST20' || clean === 'LAUNCH20') {
      setPromoCode(clean);
      setDiscountPercent(20);
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.template.price, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems: cart.length,
        subtotal,
        discount,
        total,
        promoCode,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
