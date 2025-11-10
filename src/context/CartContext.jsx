// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import AuthContext from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext();
export default CartContext;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get('/cart/');
      setCart(response.data);
      setCartCount(response.data.item_count || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart count only (lightweight)
  const fetchCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const response = await apiClient.get('/cart/count/');
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  }, [user]);

  // Add item to cart
  const addToCart = async (itemType, itemData) => {
    if (!user) {
      toast.error('Anda harus login untuk menambahkan item ke cart');
      return false;
    }

    try {
      const payload = {
        item_type: itemType,
        ...itemData,
      };

      const response = await apiClient.post('/cart/add/', payload);
      
      // Refresh cart after adding
      await fetchCart();
      
      toast.success('Item berhasil ditambahkan ke cart');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = error.response?.data?.error || 'Gagal menambahkan item ke cart';
      toast.error(errorMsg);
      return false;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!user) return false;

    try {
      await apiClient.patch(`/cart/item/${itemId}/`, { quantity });
      await fetchCart();
      toast.success('Cart berhasil diperbarui');
      return true;
    } catch (error) {
      console.error('Error updating cart item:', error);
      const errorMsg = error.response?.data?.error || 'Gagal memperbarui cart';
      toast.error(errorMsg);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!user) return false;

    try {
      await apiClient.delete(`/cart/item/${itemId}/remove/`);
      await fetchCart();
      toast.success('Item berhasil dihapus dari cart');
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      const errorMsg = error.response?.data?.error || 'Gagal menghapus item dari cart';
      toast.error(errorMsg);
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return false;

    try {
      await apiClient.delete('/cart/clear/');
      setCart(null);
      setCartCount(0);
      toast.success('Cart berhasil dikosongkan');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      const errorMsg = error.response?.data?.error || 'Gagal mengosongkan cart';
      toast.error(errorMsg);
      return false;
    }
  };

  // Checkout from cart
  const checkoutFromCart = async (couponCode = null, paymentMethod = 'MIDTRANS') => {
    if (!user) {
      toast.error('Anda harus login untuk checkout');
      return null;
    }

    try {
      const payload = {
        payment_method: paymentMethod,
      };
      if (couponCode) {
        payload.kode_kupon = couponCode;
      }

      const response = await apiClient.post('/cart/checkout/', payload);
      
      // Clear cart after checkout
      setCart(null);
      setCartCount(0);
      
      return response.data;
    } catch (error) {
      console.error('Error checkout from cart:', error);
      const errorMsg = error.response?.data?.error || 'Gagal checkout';
      toast.error(errorMsg);
      return null;
    }
  };

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
    }
  }, [user, fetchCart]);

  const contextData = {
    cart,
    cartCount,
    loading,
    fetchCart,
    fetchCartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkoutFromCart,
  };

  return (
    <CartContext.Provider value={contextData}>
      {children}
    </CartContext.Provider>
  );
};

