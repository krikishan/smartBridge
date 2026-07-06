import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderAPI } from '../../api/axios';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = { limit: 50 };
    if (filter) params.status = filter;
    orderAPI.getAll(params).then(res => { setOrders(res.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <h1 className="text-h2">Manage Orders</h1>
        <select className="form-select" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Orders</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                <td>{order.userId?.name || 'N/A'}<br /><span className="text-xs text-secondary">{order.userId?.email}</span></td>
                <td className="text-small">{formatDate(order.orderedDate)}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td><span className="badge badge-neutral">{order.paymentMethod}</span></td>
                <td><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                <td>
                  <select className="form-select" style={{ width: 130, padding: '6px 10px', fontSize: 12 }} value={order.status} onChange={e => handleStatusUpdate(order._id, e.target.value)}>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && <p className="text-secondary text-center" style={{ padding: 40 }}>No orders found</p>}
      </div>
    </AdminLayout>
  );
}
