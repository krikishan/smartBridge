import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiStar, HiOutlineStar, HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiMinus, HiPlus } from 'react-icons/hi';
import { productAPI, authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getDiscountedPrice } from '../utils/formatters';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getOne(id);
        setProduct(res.data.product);
        setSelectedImage(0);
        setQuantity(1);

        // Fetch related products
        const relRes = await productAPI.getAll({ category: res.data.product.category, limit: 4 });
        setRelatedProducts(relRes.data.products.filter(p => p._id !== id));
      } catch {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !product) {
    return (
      <div className="container" style={{ padding: '48px 24px' }}>
        <div className="pd-skeleton">
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 12 }} />
          <div>
            <div className="skeleton skeleton-text" style={{ height: 28, width: '70%', marginBottom: 16 }} />
            <div className="skeleton skeleton-text" style={{ height: 18, width: '40%', marginBottom: 24 }} />
            <div className="skeleton skeleton-text" style={{ height: 36, width: '30%', marginBottom: 24 }} />
            <div className="skeleton skeleton-text" style={{ height: 16, marginBottom: 8 }} />
            <div className="skeleton skeleton-text" style={{ height: 16, marginBottom: 8 }} />
            <div className="skeleton skeleton-text" style={{ height: 16, width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const isWishlisted = user?.wishlist?.some(w => (typeof w === 'string' ? w : w._id) === product._id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const res = await authAPI.toggleWishlist(product._id);
      updateUser({ ...user, wishlist: res.data.wishlist });
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < Math.round(rating)
        ? <HiStar key={i} className="star-filled" />
        : <HiOutlineStar key={i} className="star-empty" />
    );
  };

  return (
    <main className="product-details-page">
      <div className="container">
        <motion.div className="pd-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-image">
              <img src={product.images?.[selectedImage] || product.images?.[0]} alt={product.title} />
              {product.discount > 0 && (
                <span className="product-badge-discount">-{product.discount}%</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.title} view ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <span className="pd-category">{product.category}</span>
            <h1 className="pd-title">{product.title}</h1>

            <div className="pd-rating">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="pd-rating-text">{product.rating} ({product.numReviews} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="pd-price-original">{formatPrice(product.price)}</span>
                  <span className="badge badge-success">Save {product.discount}%</span>
                </>
              )}
            </div>

            <p className="pd-description">{product.description}</p>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Brand</span>
                <span className="pd-meta-value">{product.brand || 'N/A'}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Availability</span>
                <span className={`pd-meta-value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="pd-quantity">
                <span className="pd-meta-label">Quantity</span>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><HiMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}><HiPlus /></button>
                </div>
              </div>
            )}

            <div className="pd-actions">
              <button className="btn btn-accent btn-lg pd-add-btn" onClick={handleAddToCart} disabled={adding || product.stock === 0}>
                <HiOutlineShoppingBag /> {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
              <button className={`btn btn-outline pd-wish-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
                {isWishlisted ? <HiHeart /> : <HiOutlineHeart />}
              </button>
            </div>

            <div className="pd-features">
              <div className="pd-feature">
                <HiOutlineTruck />
                <span>Free delivery on orders above ₹999</span>
              </div>
              <div className="pd-feature">
                <HiOutlineShieldCheck />
                <span>1 year warranty included</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section pd-related">
            <h2 className="text-h2" style={{ marginBottom: 24 }}>Related Products</h2>
            <div className="grid grid-4">
              {relatedProducts.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
