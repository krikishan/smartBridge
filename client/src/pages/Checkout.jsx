import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineCash, HiOutlineCreditCard, HiOutlineDeviceMobile, HiCheck } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../api/axios';
import { formatPrice, getDiscountedPrice } from '../utils/formatters';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      fullName: defaultAddress?.fullName || user?.name || '',
      phone: defaultAddress?.phone || user?.mobile || '',
      street: defaultAddress?.street || '',
      city: defaultAddress?.city || '',
      state: defaultAddress?.state || '',
      zipCode: defaultAddress?.zipCode || '',
      country: defaultAddress?.country || 'India',
    },
  });

  const items = cart?.items || [];
  const shippingCost = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shippingCost;

  const onAddressSubmit = () => setStep(2);
  const onPaymentSelect = () => setStep(3);

  const placeOrder = async () => {
    try {
      setPlacing(true);
      const address = getValues();
      const products = items.map(item => {
        const p = item.productId;
        return {
          productId: p._id,
          title: p.title,
          price: getDiscountedPrice(p.price, p.discount),
          quantity: item.quantity,
          image: p.images?.[0] || '',
        };
      });

      const res = await orderAPI.create({
        products,
        shippingAddress: address,
        paymentMethod,
        subtotal: cartTotal,
        shippingCost,
        total,
      });

      toast.success('Order placed successfully!');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="container checkout-page">
      <h1 className="text-h1" style={{ marginBottom: 32 }}>Checkout</h1>

      {/* Steps */}
      <div className="checkout-steps">
        {['Address', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className={`checkout-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <div className="step-circle">{step > i + 1 ? <HiCheck /> : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Step 1: Address */}
          {step === 1 && (
            <motion.div className="card checkout-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-h3" style={{ marginBottom: 20 }}>Shipping Address</h2>
              <form onSubmit={handleSubmit(onAddressSubmit)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input {...register('fullName', { required: 'Required' })} className={`form-input ${errors.fullName ? 'error' : ''}`} />
                    {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input {...register('phone', { required: 'Required' })} className={`form-input ${errors.phone ? 'error' : ''}`} />
                    {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input {...register('street', { required: 'Required' })} className={`form-input ${errors.street ? 'error' : ''}`} />
                  {errors.street && <span className="form-error">{errors.street.message}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input {...register('city', { required: 'Required' })} className={`form-input ${errors.city ? 'error' : ''}`} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input {...register('state', { required: 'Required' })} className={`form-input ${errors.state ? 'error' : ''}`} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input {...register('zipCode', { required: 'Required' })} className={`form-input ${errors.zipCode ? 'error' : ''}`} />
                  </div>
                </div>
                <button type="submit" className="btn btn-accent btn-lg">Continue to Payment</button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <motion.div className="card checkout-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-h3" style={{ marginBottom: 20 }}>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: <HiOutlineCash />, desc: 'Pay when your order arrives' },
                  { value: 'UPI', label: 'UPI Payment', icon: <HiOutlineDeviceMobile />, desc: 'Pay using UPI ID' },
                  { value: 'Card', label: 'Credit / Debit Card', icon: <HiOutlineCreditCard />, desc: 'Visa, Mastercard, RuPay' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`payment-option ${paymentMethod === opt.value ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(opt.value)}
                  >
                    <div className="payment-icon">{opt.icon}</div>
                    <div>
                      <h4>{opt.label}</h4>
                      <p>{opt.desc}</p>
                    </div>
                    <div className="payment-radio">{paymentMethod === opt.value && <HiCheck />}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-accent btn-lg" onClick={onPaymentSelect}>Review Order</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div className="card checkout-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-h3" style={{ marginBottom: 20 }}>Order Review</h2>
              <div className="review-block">
                <h4>Shipping Address</h4>
                <p className="text-secondary text-small">
                  {getValues('fullName')}, {getValues('phone')}<br />
                  {getValues('street')}<br />
                  {getValues('city')}, {getValues('state')} — {getValues('zipCode')}
                </p>
              </div>
              <div className="review-block">
                <h4>Payment: {paymentMethod}</h4>
              </div>
              <div className="review-block">
                <h4>Items ({items.length})</h4>
                {items.map(item => {
                  const p = item.productId;
                  if (!p) return null;
                  return (
                    <div key={p._id} className="review-item">
                      <img src={p.images?.[0]} alt={p.title} />
                      <div>
                        <p className="text-small" style={{ fontWeight: 600 }}>{p.title}</p>
                        <p className="text-xs text-secondary">Qty: {item.quantity} × {formatPrice(getDiscountedPrice(p.price, p.discount))}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-accent btn-lg" onClick={placeOrder} disabled={placing}>
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary */}
        <div className="cart-summary card">
          <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : formatPrice(shippingCost)}</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </div>
    </main>
  );
}
