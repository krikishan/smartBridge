import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { adminAPI } from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getConfig().then(res => { setCategories(res.data.config?.categories?.filter(c => c.isActive) || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="container" style={{ padding: '32px 24px 96px' }}>
      <div className="section-header" style={{ marginBottom: 40 }}>
        <h1 className="text-h1">All Categories</h1>
        <p className="text-secondary">Browse products by category</p>
      </div>
      {loading ? (
        <div className="grid grid-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton" style={{ height: 180 }} /><div style={{ padding: 16 }}><div className="skeleton skeleton-text" /></div></div>)}</div>
      ) : (
        <motion.div className="grid grid-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {categories.map((cat, i) => (
            <Link to={`/products?category=${encodeURIComponent(cat.name)}`} key={i} className="card card-lift" style={{ overflow: 'hidden' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
              </div>
              <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{cat.name}</h3>
                  <p className="text-xs text-secondary">{cat.description}</p>
                </div>
                <HiArrowRight style={{ color: 'var(--color-accent)' }} />
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </main>
  );
}
