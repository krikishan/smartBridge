import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineHeart } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axios';
import ProductCard from '../components/product/ProductCard';

export default function Wishlist() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getProfile().then(res => {
      updateUser(res.data.user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = useCallback(() => {
    authAPI.getProfile().then(res => updateUser(res.data.user)).catch(() => {});
  }, [updateUser]);

  const wishlist = user?.wishlist || [];

  if (loading) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 className="text-h1" style={{ marginBottom: 24 }}>Wishlist</h1>
        <div className="grid grid-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton skeleton-image" /><div style={{ padding: 16 }}><div className="skeleton skeleton-text" /><div className="skeleton skeleton-text" style={{ width: '60%' }} /></div></div>)}</div>
      </div>
    );
  }

  return (
    <main className="container" style={{ padding: '32px 24px 96px' }}>
      <h1 className="text-h1" style={{ marginBottom: 8 }}>Wishlist</h1>
      <p className="text-secondary" style={{ marginBottom: 32 }}>{wishlist.length} items saved</p>
      {wishlist.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <HiOutlineHeart style={{ fontSize: 56, color: 'var(--color-text-tertiary)', marginBottom: 16 }} />
          <h3>Your wishlist is empty</h3>
          <p className="text-secondary">Start adding items you love</p>
        </div>
      ) : (
        <motion.div className="grid grid-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {wishlist.map(product => typeof product === 'object' && product !== null ? (
            <ProductCard key={product._id} product={product} onWishlistChange={handleChange} />
          ) : null)}
        </motion.div>
      )}
    </main>
  );
}
