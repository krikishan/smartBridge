import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineLocationMarker, HiOutlineLogout, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { authAPI, orderAPI } from '../api/axios';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', mobile: user?.mobile || '' });
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' });

  useEffect(() => {
    if (tab === 'orders') {
      orderAPI.getUserOrders().then(res => setOrders(res.data.orders)).catch(() => {});
    }
  }, [tab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.addAddress(addressForm);
      updateUser({ ...user, addresses: res.data.addresses });
      setAddingAddress(false);
      setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'India' });
      toast.success('Address added');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('Address deleted');
    } catch { toast.error('Failed'); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: <HiOutlineUser /> },
    { key: 'orders', label: 'Orders', icon: <HiOutlineShoppingBag /> },
    { key: 'wishlist', label: 'Wishlist', icon: <HiOutlineHeart /> },
    { key: 'addresses', label: 'Addresses', icon: <HiOutlineLocationMarker /> },
  ];

  return (
    <main className="container profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p className="text-small text-secondary">{user?.email}</p>
          </div>
          <nav className="profile-nav">
            {tabs.map(t => (
              <button key={t.key} className={`profile-nav-item ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                {t.icon} {t.label}
              </button>
            ))}
            <button className="profile-nav-item logout-btn" onClick={handleLogout}>
              <HiOutlineLogout /> Logout
            </button>
          </nav>
        </aside>

        <div className="profile-content">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                <h2 className="text-h3">Personal Information</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
                  <HiOutlinePencil /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Mobile</label><input className="form-input" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
                  <button type="submit" className="btn btn-accent">Save Changes</button>
                </form>
              ) : (
                <div className="profile-info-grid">
                  <div><span className="text-small text-secondary">Name</span><p style={{ fontWeight: 600 }}>{user?.name}</p></div>
                  <div><span className="text-small text-secondary">Email</span><p style={{ fontWeight: 600 }}>{user?.email}</p></div>
                  <div><span className="text-small text-secondary">Mobile</span><p style={{ fontWeight: 600 }}>{user?.mobile || 'Not provided'}</p></div>
                  <div><span className="text-small text-secondary">Member Since</span><p style={{ fontWeight: 600 }}>{formatDate(user?.createdAt)}</p></div>
                </div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-h3" style={{ marginBottom: 20 }}>Order History</h2>
              {orders.length === 0 ? (
                <div className="card empty-state" style={{ padding: 48 }}>
                  <p>No orders yet</p>
                  <Link to="/products" className="btn btn-accent" style={{ marginTop: 16 }}>Start Shopping</Link>
                </div>
              ) : orders.map(order => (
                <div key={order._id} className="card order-card">
                  <div className="order-card-header">
                    <div>
                      <p className="text-xs text-secondary">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-secondary">{formatDate(order.orderedDate)}</p>
                    </div>
                    <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="order-card-items">
                    {order.products.map((p, i) => (
                      <div key={i} className="order-item-mini">
                        <img src={p.image} alt={p.title} />
                        <div>
                          <p className="text-small" style={{ fontWeight: 500 }}>{p.title}</p>
                          <p className="text-xs text-secondary">Qty: {p.quantity} × {formatPrice(p.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <span className="text-small" style={{ fontWeight: 700 }}>Total: {formatPrice(order.total)}</span>
                    <span className="text-xs text-secondary">Payment: {order.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Wishlist Tab */}
          {tab === 'wishlist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-h3" style={{ marginBottom: 20 }}>Wishlist</h2>
              {user?.wishlist?.length === 0 ? (
                <div className="card empty-state" style={{ padding: 48 }}><p>Your wishlist is empty</p></div>
              ) : (
                <p className="text-secondary" style={{ marginBottom: 16 }}>
                  <Link to="/wishlist" className="auth-link">View full wishlist →</Link>
                </p>
              )}
            </motion.div>
          )}

          {/* Addresses Tab */}
          {tab === 'addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
                <h2 className="text-h3">Saved Addresses</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setAddingAddress(!addingAddress)}>
                  <HiOutlinePlus /> Add Address
                </button>
              </div>
              {addingAddress && (
                <form className="card" style={{ padding: 20, marginBottom: 16 }} onSubmit={handleAddAddress}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Street</label><input className="form-input" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="form-group"><label className="form-label">City</label><input className="form-input" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">State</label><input className="form-input" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">ZIP</label><input className="form-input" required value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} /></div>
                  </div>
                  <button type="submit" className="btn btn-accent">Save Address</button>
                </form>
              )}
              {user?.addresses?.length === 0 && !addingAddress ? (
                <div className="card empty-state" style={{ padding: 48 }}><p>No saved addresses</p></div>
              ) : (
                <div className="addresses-grid">
                  {user?.addresses?.map(addr => (
                    <div key={addr._id} className="card address-card">
                      {addr.isDefault && <span className="badge badge-accent" style={{ marginBottom: 8 }}>Default</span>}
                      <p style={{ fontWeight: 600 }}>{addr.fullName}</p>
                      <p className="text-small text-secondary">{addr.phone}</p>
                      <p className="text-small text-secondary">{addr.street}, {addr.city}, {addr.state} — {addr.zipCode}</p>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteAddress(addr._id)} style={{ marginTop: 8 }}>
                        <HiOutlineTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
