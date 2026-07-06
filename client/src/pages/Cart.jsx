import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMinus, HiPlus, HiOutlineTrash, HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { formatPrice, getDiscountedPrice } from '../utils/formatters';
import './Cart.css';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const items = cart?.items || [];
  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shippingCost;

  if (loading) {
    return (
      <div className="container cart-page">
        <h1 className="text-h1" style={{ marginBottom: 24 }}>Shopping Cart</h1>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton-card" style={{ display: 'flex', gap: 16, padding: 16, marginBottom: 12 }}>
            <div className="skeleton" style={{ width: 100, height: 100, borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container cart-page">
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <HiOutlineShoppingBag style={{ fontSize: 56, color: 'var(--color-text-tertiary)', marginBottom: 16 }} />
          <h2>Your cart is empty</h2>
          <p className="text-secondary" style={{ marginBottom: 24 }}>Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="btn btn-accent btn-lg">Browse Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <h1 className="text-h1" style={{ marginBottom: 24 }}>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const p = item.productId;
            if (!p) return null;
            const discounted = getDiscountedPrice(p.price, p.discount);
            return (
              <motion.div
                key={p._id}
                className="cart-item card"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <Link to={`/products/${p._id}`} className="cart-item-image">
                  <img src={p.images?.[0]} alt={p.title} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${p._id}`} className="cart-item-title">{p.title}</Link>
                  <p className="cart-item-category">{p.category} · {p.brand}</p>
                  <div className="cart-item-price">
                    <span className="price-current">{formatPrice(discounted)}</span>
                    {p.discount > 0 && <span className="price-original">{formatPrice(p.price)}</span>}
                  </div>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(p._id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}><HiMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(p._id, item.quantity + 1)}><HiPlus /></button>
                  </div>
                  <p className="cart-item-subtotal">{formatPrice(discounted * item.quantity)}</p>
                  <button className="btn btn-ghost btn-sm cart-remove-btn" onClick={() => removeItem(p._id)}>
                    <HiOutlineTrash /> Remove
                  </button>
                </div>
              </motion.div>
            );
          })}
          <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ marginTop: 8 }}>Clear Cart</button>
        </div>

        <div className="cart-summary card">
          <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({items.length} items)</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : formatPrice(shippingCost)}</span>
          </div>
          {shippingCost > 0 && (
            <p className="shipping-note">Add {formatPrice(999 - cartTotal)} more for free shipping</p>
          )}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-accent btn-lg btn-full" onClick={() => navigate('/checkout')} style={{ marginTop: 20 }}>
            Proceed to Checkout <HiArrowRight />
          </button>
        </div>
      </div>
    </main>
  );
}
