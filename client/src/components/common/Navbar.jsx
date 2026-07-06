import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useDebounce, useClickOutside } from '../../hooks/useDebounce';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);
  const userMenuRef = useClickOutside(closeUserMenu);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="ShopEZ Home">
          <span className="brand-icon">S</span>
          <span className="brand-text">ShopEZ</span>
        </Link>

        <nav className="navbar-nav desktop-nav" role="navigation" aria-label="Main navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          {isAdmin && <Link to="/admin" className="nav-link nav-admin">Admin</Link>}
        </nav>

        <form className="navbar-search desktop-search" onSubmit={handleSearch} role="search">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search products"
          />
        </form>

        <div className="navbar-actions">
          {isAuthenticated && (
            <Link to="/wishlist" className="nav-action" aria-label="Wishlist">
              <HiOutlineHeart />
            </Link>
          )}
          <Link to="/cart" className="nav-action cart-action" aria-label={`Cart with ${cartCount} items`}>
            <HiOutlineShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="nav-action user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Orders</Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm nav-login-btn">
              Sign In
            </Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form className="mobile-search" onSubmit={handleSearch}>
              <HiOutlineSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
            <nav className="mobile-nav">
              <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/categories" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
