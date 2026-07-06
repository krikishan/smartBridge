import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCurrencyRupee, HiOutlineChatAlt2, HiOutlineStar } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { productAPI, adminAPI } from '../api/axios';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, trendingRes, configRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ trending: 'true', limit: 8 }),
          adminAPI.getConfig(),
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setTrendingProducts(trendingRes.data.products);
        setCategories(configRes.data.config?.categories || []);
        setBanners(configRes.data.config?.banner || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4 },
  };

  const reviews = [
    { name: 'Priya Sharma', rating: 5, text: 'Absolutely love the quality of products! Delivery was super fast and the packaging was excellent. Will definitely shop again.', avatar: 'P' },
    { name: 'Rahul Kumar', rating: 5, text: 'Best online shopping experience I\'ve had. The prices are competitive and the product quality exceeded my expectations.', avatar: 'R' },
    { name: 'Anita Patel', rating: 4, text: 'Great collection of products across categories. The UI is clean and easy to navigate. Customer support was very helpful.', avatar: 'A' },
  ];

  if (loading) {
    return (
      <div className="home-loading">
        <div className="container">
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)', marginBottom: 48 }} />
          <div className="grid grid-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div style={{ padding: 16 }}>
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="home-page">
      {/* Hero Banner */}
      <section className="hero-section" aria-label="Featured promotions">
        <div className="container">
          <div className="hero-banner">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="hero-overlay" />
                <div className="hero-content">
                  <motion.h1
                    className="text-hero hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentBanner ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentBanner ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    {banner.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentBanner ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Link to={banner.link || '/products'} className="btn btn-accent btn-lg hero-btn">
                      Shop Now <HiArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <div className="hero-dots">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-dot ${index === currentBanner ? 'active' : ''}`}
                    onClick={() => setCurrentBanner(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <HiOutlineTruck className="trust-icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above ₹999</p>
              </div>
            </div>
            <div className="trust-item">
              <HiOutlineShieldCheck className="trust-icon" />
              <div>
                <h4>Secure Payment</h4>
                <p>100% protected</p>
              </div>
            </div>
            <div className="trust-item">
              <HiOutlineCurrencyRupee className="trust-icon" />
              <div>
                <h4>Best Prices</h4>
                <p>Guaranteed savings</p>
              </div>
            </div>
            <div className="trust-item">
              <HiOutlineChatAlt2 className="trust-icon" />
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <motion.section className="section" aria-label="Featured categories" {...fadeUp}>
          <div className="container">
            <div className="section-header">
              <h2>Shop by Category</h2>
              <p>Browse our curated collection across popular categories</p>
            </div>
            <div className="categories-grid">
              {categories.filter(c => c.isActive).map((cat, i) => (
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  key={i}
                  className="category-card card card-lift"
                >
                  <div className="category-image-wrapper">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                  </div>
                  <div className="category-info">
                    <h3>{cat.name}</h3>
                    <span className="category-link">
                      Explore <HiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Popular Products */}
      {featuredProducts.length > 0 && (
        <motion.section className="section section-alt" aria-label="Popular products" {...fadeUp}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <h2 className="text-h1">Popular Products</h2>
                <p className="text-secondary">Handpicked favorites our customers love</p>
              </div>
              <Link to="/products?featured=true" className="btn btn-outline">
                View All <HiArrowRight />
              </Link>
            </div>
            <div className="grid grid-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Offers Banner */}
      <motion.section className="offers-section" aria-label="Special offers" {...fadeUp}>
        <div className="container">
          <div className="offers-grid">
            <div className="offer-card offer-card-primary">
              <div className="offer-content">
                <span className="offer-tag">Limited Time</span>
                <h3>Summer Sale</h3>
                <p>Up to 50% off on electronics and fashion</p>
                <Link to="/products?sort=price_asc" className="btn btn-accent">
                  Shop Deals <HiArrowRight />
                </Link>
              </div>
            </div>
            <div className="offer-card offer-card-secondary">
              <div className="offer-content">
                <span className="offer-tag">New Arrivals</span>
                <h3>Fresh Collection</h3>
                <p>Discover the latest products just added</p>
                <Link to="/products?sort=newest" className="btn btn-primary">
                  Explore <HiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <motion.section className="section" aria-label="Trending products" {...fadeUp}>
          <div className="container">
            <div className="section-header-row">
              <div>
                <h2 className="text-h1">Trending Now</h2>
                <p className="text-secondary">What everyone's adding to their cart</p>
              </div>
              <Link to="/products?trending=true" className="btn btn-outline">
                View All <HiArrowRight />
              </Link>
            </div>
            <div className="grid grid-4">
              {trendingProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Customer Reviews */}
      <motion.section className="section section-alt" aria-label="Customer reviews" {...fadeUp}>
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real shoppers</p>
          </div>
          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <div key={i} className="review-card card">
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, j) => (
                    <HiOutlineStar key={j} className="star-filled" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{review.avatar}</div>
                  <span className="review-name">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section className="newsletter-section" aria-label="Newsletter signup" {...fadeUp}>
        <div className="container">
          <div className="newsletter-content">
            <h2 className="text-h1">Stay in the Loop</h2>
            <p>Subscribe to get exclusive offers, new arrivals, and insider-only discounts.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-accent btn-lg">Subscribe</button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
