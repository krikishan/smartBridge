import { memo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiOutlineStar, HiStar, HiOutlineEye } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { authAPI } from '../../api/axios';
import { formatPrice, getDiscountedPrice, truncateText } from '../../utils/formatters';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = memo(function ProductCard({ product, onWishlistChange }) {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const isWishlisted = user?.wishlist?.some(
    (w) => (typeof w === 'string' ? w : w._id) === product._id
  );

  const discountedPrice = getDiscountedPrice(product.price, product.discount);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  }, [isAuthenticated, addToCart, product._id, navigate]);

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await authAPI.toggleWishlist(product._id);
      updateUser({ ...user, wishlist: res.data.wishlist });
      if (onWishlistChange) onWishlistChange();
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  }, [isAuthenticated, isWishlisted, product._id, user, updateUser, navigate, onWishlistChange]);

  const handleShopNow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  }, [navigate, product._id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating)
          ? <HiStar key={i} className="star-filled" />
          : <HiOutlineStar key={i} className="star-empty" />
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="product-card card card-lift"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-card-image-wrapper">
          {!imageLoaded && <div className="skeleton skeleton-image" />}
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
            alt={product.title}
            className={`product-card-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {product.discount > 0 && (
            <span className="product-badge-discount">-{product.discount}%</span>
          )}
          <div className="product-card-actions">
            <button
              className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
            </button>
            <button
              className="action-btn quickview-btn"
              onClick={handleShopNow}
              aria-label="Quick view"
            >
              <HiOutlineEye />
            </button>
          </div>
        </div>

        <div className="product-card-body">
          <p className="product-card-category">{product.category}</p>
          <h3 className="product-card-title">{truncateText(product.title, 48)}</h3>

          <div className="product-card-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-count">({product.numReviews})</span>
          </div>

          <div className="product-card-price">
            <span className="price-current">{formatPrice(discountedPrice)}</span>
            {product.discount > 0 && (
              <span className="price-original">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="product-card-footer">
            <button
              className="btn btn-accent btn-sm product-add-btn"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleShopNow}>
              Shop Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;
