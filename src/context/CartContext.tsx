"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Product, CartItem, CartContextType, AppliedCoupon } from "@/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const addToCart = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount;
  }, [appliedCoupon]);

  const finalPrice = useMemo(() => {
    return Math.max(0, totalPrice - discountAmount);
  }, [totalPrice, discountAmount]);

  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`/api/coupons?code=${encodeURIComponent(code)}&cartTotal=${totalPrice}`);
      const data = await response.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountType: data.coupon.discountType,
          discountValue: data.coupon.discountValue,
          discountAmount: data.discount,
        });
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Failed to apply coupon" };
    }
  }, [totalPrice]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Remove coupon when cart is empty or total price changes significantly
  useMemo(() => {
    if (items.length === 0) {
      setAppliedCoupon(null);
    }
  }, [items.length]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      discountAmount,
      finalPrice,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      isOpen,
      setIsOpen,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, discountAmount, finalPrice, appliedCoupon, applyCoupon, removeCoupon, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
