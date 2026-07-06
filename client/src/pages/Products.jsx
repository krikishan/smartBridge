import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../api/axios';
import { SORT_OPTIONS, PRICE_RANGES } from '../utils/constants';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeRating = searchParams.get('rating') || '';
  const activePage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getBrands(),
        ]);
        setCategories(catRes.data.categories);
        setBrands(brandRes.data.brands);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: activePage,
          limit: 12,
          sort: activeSort,
        };
        if (activeCategory) params.category = activeCategory;
        if (activeBrand) params.brand = activeBrand;
        if (activeMinPrice) params.minPrice = activeMinPrice;
        if (activeMaxPrice) params.maxPrice = activeMaxPrice;
        if (activeRating) params.rating = activeRating;
        if (searchParams.get('featured')) params.featured = 'true';
        if (searchParams.get('trending')) params.trending = 'true';

        const res = await productAPI.getAll(params);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({ sort: 'newest' });
  }, [setSearchParams]);

  const setPage = useCallback((page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, setSearchParams]);

  const hasFilters = activeCategory || activeBrand || activeMinPrice || activeMaxPrice || activeRating;

  return (
    <main className="products-page">
      <div className="container">
        <div className="products-header">
          <div>
            <h1 className="text-h1">Products</h1>
            <p className="text-secondary">{pagination.total} products found</p>
          </div>
          <div className="products-header-actions">
            <select
              className="form-select sort-select"
              value={activeSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className="btn btn-outline filter-toggle-btn"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <HiOutlineAdjustments /> Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${filtersOpen ? 'open' : ''}`} aria-label="Product filters">
            <div className="filters-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear All</button>
              )}
              <button className="filter-close-btn" onClick={() => setFiltersOpen(false)}>
                <HiOutlineX />
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {categories.map((cat) => (
                  <label key={cat} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === cat}
                      onChange={() => updateFilter('category', activeCategory === cat ? '' : cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Brand</h4>
              <div className="filter-options">
                {brands.slice(0, 10).map((brand) => (
                  <label key={brand} className="filter-option">
                    <input
                      type="radio"
                      name="brand"
                      checked={activeBrand === brand}
                      onChange={() => updateFilter('brand', activeBrand === brand ? '' : brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price</h4>
              <div className="filter-options">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="filter-option">
                    <input
                      type="radio"
                      name="price"
                      checked={
                        activeMinPrice === String(range.min) &&
                        (range.max ? activeMaxPrice === String(range.max) : !activeMaxPrice)
                      }
                      onChange={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('minPrice', String(range.min));
                        if (range.max) {
                          params.set('maxPrice', String(range.max));
                        } else {
                          params.delete('maxPrice');
                        }
                        params.set('page', '1');
                        setSearchParams(params);
                      }}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Rating</h4>
              <div className="filter-options">
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={activeRating === String(r)}
                      onChange={() => updateFilter('rating', activeRating === String(r) ? '' : String(r))}
                    />
                    <span>{r}★ & above</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            {/* Active Filters */}
            {hasFilters && (
              <div className="active-filters">
                {activeCategory && (
                  <span className="active-filter-tag">
                    {activeCategory}
                    <button onClick={() => updateFilter('category', '')}><HiOutlineX /></button>
                  </span>
                )}
                {activeBrand && (
                  <span className="active-filter-tag">
                    {activeBrand}
                    <button onClick={() => updateFilter('brand', '')}><HiOutlineX /></button>
                  </span>
                )}
                {activeMinPrice && (
                  <span className="active-filter-tag">
                    Price filter
                    <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}><HiOutlineX /></button>
                  </span>
                )}
                {activeRating && (
                  <span className="active-filter-tag">
                    {activeRating}★+
                    <button onClick={() => updateFilter('rating', '')}><HiOutlineX /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton skeleton-image" />
                    <div style={{ padding: 16 }}>
                      <div className="skeleton skeleton-text" />
                      <div className="skeleton skeleton-text" />
                      <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p className="text-secondary">Try adjusting your filters or search terms</p>
                <button className="btn btn-accent" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={activePage <= 1}
                      onClick={() => setPage(activePage - 1)}
                    >
                      Previous
                    </button>
                    <div className="pagination-pages">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`pagination-btn ${activePage === i + 1 ? 'active' : ''}`}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={activePage >= pagination.pages}
                      onClick={() => setPage(activePage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {filtersOpen && <div className="filter-overlay" onClick={() => setFiltersOpen(false)} />}
    </main>
  );
}
