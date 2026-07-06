import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../api/axios';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getUserOrders().then(res => { setOrders(res.data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '48px 24px' }}><h1 className="text-h1" style={{ marginBottom: 24 }}>My Orders</h1>{[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" style={{ marginBottom: 12, padding: 20 }}><div className="skeleton skeleton-text" /><div className="skeleton skeleton-text" style={{ width: '60%' }} /></div>)}</div>;
  }

  return (
    <main className="container" style={{ padding: '32px 24px 96px' }}>
      <h1 className="text-h1" style={{ marginBottom: 8 }}>My Orders</h1>
      <p className="text-secondary" style={{ marginBottom: 32 }}>{orders.length} orders placed</p>
      {orders.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <h3>No orders yet</h3>
          <p className="text-secondary" style={{ marginBottom: 24 }}>When you place orders, they'll appear here</p>
          <Link to="/products" className="btn btn-accent">Start Shopping</Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ padding: 20, marginBottom: 12 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                <div>
                  <p className="text-small" style={{ fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-secondary">{formatDate(order.orderedDate)} · {order.paymentMethod}</p>
                </div>
                <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {order.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-sm" style={{ background: 'var(--color-bg)', padding: '6px 10px', borderRadius: 8 }}>
                    {p.image && <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />}
                    <span className="text-xs">{p.title?.substring(0, 30)}{p.title?.length > 30 ? '...' : ''}</span>
                  </div>
                ))}
              </div>
              <p className="text-small" style={{ fontWeight: 700 }}>Total: {formatPrice(order.total)}</p>
            </div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
