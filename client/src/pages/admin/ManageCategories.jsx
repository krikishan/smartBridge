import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', description: '' });

  const fetchCategories = () => {
    adminAPI.getCategories().then(res => { setCategories(res.data.categories); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateCategory(editingId, form);
        toast.success('Category updated');
      } else {
        await adminAPI.addCategory({ ...form, isActive: true });
        toast.success('Category added');
      }
      setShowModal(false); setEditingId(null); setForm({ name: '', image: '', description: '' }); fetchCategories();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await adminAPI.deleteCategory(id); toast.success('Deleted'); fetchCategories(); } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <h1 className="text-h2">Manage Categories</h1>
        <button className="btn btn-accent" onClick={() => { setForm({ name: '', image: '', description: '' }); setEditingId(null); setShowModal(true); }}><HiOutlinePlus /> Add Category</button>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Category</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td><div className="table-product-info">{c.image && <img src={c.image} alt="" className="table-product-img" />}<span style={{ fontWeight: 500 }}>{c.name}</span></div></td>
                <td className="text-small text-secondary">{c.description}</td>
                <td><span className={`badge ${c.isActive ? 'badge-success' : 'badge-neutral'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td><div className="table-actions"><button className="btn btn-ghost btn-sm" onClick={() => { setForm({ name: c.name, image: c.image, description: c.description }); setEditingId(c._id); setShowModal(true); }}><HiOutlinePencil /></button><button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(c._id)}><HiOutlineTrash /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
              <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <button type="submit" className="btn btn-accent btn-full">{editingId ? 'Update' : 'Add'} Category</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
