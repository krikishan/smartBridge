import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../api/axios';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      productAPI.getAll({ search: query, limit: 24 }).then(res => { setProducts(res.data.products); setLoading(false); }).catch(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <main className="container" style={{ padding: '32px 24px 96px' }}>
      <h1 className="text-h1" style={{ marginBottom: 4 }}>Search Results</h1>
      <p className="text-secondary" style={{ marginBottom: 32 }}>
        {query ? `${products.length} results for "${query}"` : 'Enter a search term to find products'}
      </p>
      {loading ? (
        <div className="grid grid-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton skeleton-image" /><div style={{ padding: 16 }}><div className="skeleton skeleton-text" /><div className="skeleton skeleton-text" style={{ width: '60%' }} /></div></div>)}</div>
      ) : products.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <HiOutlineSearch style={{ fontSize: 56, color: 'var(--color-text-tertiary)', marginBottom: 16 }} />
          <h3>No products found</h3>
          <p className="text-secondary">Try a different search term</p>
        </div>
      ) : (
        <motion.div className="grid grid-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </motion.div>
      )}
    </main>
  );
}
