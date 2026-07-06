import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const res = await cartAPI.add({ productId, quantity });
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const res = await cartAPI.updateQuantity(productId, quantity);
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const res = await cartAPI.remove(productId);
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart({ items: [] });
  }, []);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartTotal = cart?.items?.reduce((sum, item) => {
    const product = item.productId;
    if (!product) return sum;
    const price = product.price - (product.price * (product.discount || 0)) / 100;
    return sum + price * item.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export default CartContext;
