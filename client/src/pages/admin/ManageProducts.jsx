import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import AdminLayout from '../../components/admin/AdminLayout';
import { productAPI } from '../../api/axios';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const emptyProduct = { title: '', description: '', price: '', discount: 0, stock: '', category: '', brand: '', images: [''], isFeatured: false, isTrending: false };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const fetchProducts = () => {
    setLoading(true);
    productAPI.getAll({ limit: 100 }).then(res => { setProducts(res.data.products); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (editingId) {
        await productAPI.update(editingId, data);
        toast.success('Product updated');
      } else {
        await productAPI.create(data);
        toast.success('Product created');
      }
      setShowModal(false);
      setEditingId(null);
      setForm(emptyProduct);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (product) => {
    setForm({ title: product.title, description: product.description, price: product.price, discount: product.discount, stock: product.stock, category: product.category, brand: product.brand, images: product.images?.length ? product.images : [''], isFeatured: product.isFeatured, isTrending: product.isTrending });
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
        <h1 className="text-h2">Manage Products</h1>
        <button className="btn btn-accent" onClick={() => { setForm(emptyProduct); setEditingId(null); setShowModal(true); }}>
          <HiOutlinePlus /> Add Product
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><div className="table-product-info"><img src={p.images?.[0]} alt="" className="table-product-img" /><span style={{ fontWeight: 500 }}>{p.title.substring(0, 40)}</span></div></td>
                <td>{p.category}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(p.price)}</td>
                <td><span className={p.stock > 0 ? '' : 'text-danger'}>{p.stock}</span></td>
                <td>{p.rating}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}><HiOutlinePencil /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(p._id)}><HiOutlineTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center" style={{ marginBottom: 20 }}>
              <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} required value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Discount (%)</label><input className="form-input" type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="form-label">Category</label><input className="form-input" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Brand</label><input className="form-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={form.images[0]} onChange={e => setForm({...form, images: [e.target.value]})} placeholder="https://..." /></div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> Featured</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}><input type="checkbox" checked={form.isTrending} onChange={e => setForm({...form, isTrending: e.target.checked})} /> Trending</label>
              </div>
              <button type="submit" className="btn btn-accent btn-full">{editingId ? 'Update Product' : 'Create Product'}</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
