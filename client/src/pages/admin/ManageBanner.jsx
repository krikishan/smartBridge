import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '' });

  const fetchBanners = () => {
    adminAPI.getConfig().then(res => { setBanners(res.data.config?.banner || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addBanner({ ...form, isActive: true });
      toast.success('Banner added');
      setShowModal(false); setForm({ title: '', subtitle: '', image: '', link: '' }); fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try { await adminAPI.deleteBanner(id); toast.success('Deleted'); fetchBanners(); } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <h1 className="text-h2">Manage Banner</h1>
        <button className="btn btn-accent" onClick={() => setShowModal(true)}><HiOutlinePlus /> Add Banner</button>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {banners.map(b => (
          <div key={b._id} className="card" style={{ display: 'flex', gap: 16, padding: 16 }}>
            <img src={b.image} alt={b.title} style={{ width: 200, height: 120, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{b.title}</h3>
              <p className="text-small text-secondary" style={{ marginBottom: 4 }}>{b.subtitle}</p>
              <p className="text-xs text-secondary">Link: {b.link || 'None'}</p>
              <span className={`badge ${b.isActive ? 'badge-success' : 'badge-neutral'}`} style={{ marginTop: 8 }}>{b.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', alignSelf: 'flex-start' }} onClick={() => handleDelete(b._id)}><HiOutlineTrash /></button>
          </div>
        ))}
        {banners.length === 0 && !loading && <p className="text-secondary" style={{ padding: 40, textAlign: 'center' }}>No banners yet</p>}
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
              <h2>Add Banner</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Subtitle</label><input className="form-input" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" required value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Link</label><input className="form-input" value={form.link} onChange={e => setForm({...form, link: e.target.value})} placeholder="/products?category=..." /></div>
              <button type="submit" className="btn btn-accent btn-full">Add Banner</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
