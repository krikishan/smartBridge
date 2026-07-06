import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineCube, HiOutlineShoppingBag, HiOutlineCurrencyRupee } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../api/axios';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(res => { setStats(res.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <h1 className="text-h2" style={{ marginBottom: 24 }}>Dashboard</h1>
        <div className="stats-grid">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />)}</div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <HiOutlineCurrencyRupee />, color: '#0F766E', bg: 'rgba(15,118,110,0.1)' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <HiOutlineShoppingBag />, color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <HiOutlineCube />, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <HiOutlineUsers />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  ];

  const barHeights = stats?.monthlyRevenue?.map(m => m.revenue) || [];
  const maxRevenue = Math.max(...barHeights, 1);

  return (
    <AdminLayout>
      <h1 className="text-h2" style={{ marginBottom: 24 }}>Dashboard</h1>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-header">
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
              <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <h3>Monthly Revenue</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, paddingTop: 20 }}>
          {(stats?.monthlyRevenue || []).map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span className="text-xs text-secondary">{formatPrice(m.revenue)}</span>
              <div style={{ width: '100%', maxWidth: 48, background: 'var(--color-accent)', borderRadius: '6px 6px 0 0', height: `${Math.max(10, (m.revenue / maxRevenue) * 160)}px`, transition: 'height 0.3s' }} />
              <span className="text-xs text-secondary">
                {new Date(0, m._id.month - 1).toLocaleString('en', { month: 'short' })}
              </span>
            </div>
          ))}
          {(!stats?.monthlyRevenue || stats.monthlyRevenue.length === 0) && (
            <p className="text-secondary text-small" style={{ margin: 'auto' }}>No revenue data yet</p>
          )}
        </div>
      </div>

      {/* Order Status */}
      <div className="chart-container">
        <h3>Order Status Overview</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
          {Object.entries(stats?.statusCounts || {}).map(([status, count]) => (
            <div key={status} style={{ padding: '12px 20px', background: 'var(--color-bg)', borderRadius: 8 }}>
              <p style={{ fontSize: 24, fontWeight: 700 }}>{count}</p>
              <span className={`badge ${getStatusColor(status)}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-table-wrapper">
        <div style={{ padding: '16px 16px 0' }}><h3>Recent Orders</h3></div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentOrders || []).map(order => (
              <tr key={order._id}>
                <td className="text-small" style={{ fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</td>
                <td className="text-small">{order.userId?.name || 'Unknown'}</td>
                <td className="text-small text-secondary">{formatDate(order.orderedDate)}</td>
                <td className="text-small" style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
