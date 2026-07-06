import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineShoppingBag } from 'react-icons/hi';
import { orderAPI } from '../api/axios';
import { formatPrice, formatDate } from '../utils/formatters';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getOne(orderId).then(res => setOrder(res.data.order)).catch(() => {});
  }, [orderId]);

  return (
    <main className="container order-success-page">
      <motion.div className="success-card card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <div className="success-icon"><HiOutlineCheckCircle /></div>
        <h1>Order Placed Successfully!</h1>
        <p className="text-secondary">Thank you for your purchase. Your order has been confirmed.</p>
        {order && (
          <div className="success-details">
            <div className="success-row"><span>Order ID</span><span className="text-small" style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</span></div>
            <div className="success-row"><span>Date</span><span>{formatDate(order.orderedDate)}</span></div>
            <div className="success-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
            <div className="success-row"><span>Total</span><span style={{ fontWeight: 700 }}>{formatPrice(order.total)}</span></div>
            <div className="success-row"><span>Status</span><span className="badge badge-success">{order.status}</span></div>
          </div>
        )}
        <div className="success-actions">
          <Link to="/orders" className="btn btn-accent btn-lg">View Orders</Link>
          <Link to="/products" className="btn btn-outline btn-lg"><HiOutlineShoppingBag /> Continue Shopping</Link>
        </div>
      </motion.div>
    </main>
  );
}
