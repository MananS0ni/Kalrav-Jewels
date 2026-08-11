import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import SEO from '../../components/SEO/SEO';
import './Collections.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
const categories = [
  { slug: 'all', label: 'All Pieces' },
  { slug: 'rings', label: 'Rings' },
  { slug: 'necklaces', label: 'Necklaces' },
  { slug: 'earrings', label: 'Earrings' },
  { slug: 'bracelets', label: 'Bracelets' },
  { slug: 'chains', label: 'Chains' },
];

const priceRanges = [
  { slug: 'all', label: 'All Prices' },
  { slug: 'under-2000', label: 'Under ₹2,000' },
  { slug: '2000-5000', label: '₹2,000 - ₹5,000' },
  { slug: 'above-5000', label: 'Above ₹5,000' },
];

const sortOptions = [
  { slug: 'default', label: 'Featured' },
  { slug: 'price-asc', label: 'Price: Low to High' },
  { slug: 'price-desc', label: 'Price: High to Low' },
];

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Consolidated Filter Drawer State & Drafts
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(initialCat);
  const [draftPriceRange, setDraftPriceRange] = useState('all');
  const [draftSortBy, setDraftSortBy] = useState('default');

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => { setAllProducts(data); setLoading(false); })
      .catch(() => { setError('Failed to load products.'); setLoading(false); });
  }, []);

  // Synchronize drafts when drawer opens
  const openFilterDrawer = () => {
    setDraftCategory(activeCategory);
    setDraftPriceRange(priceRange);
    setDraftSortBy(sortBy);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setActiveCategory(draftCategory);
    setPriceRange(draftPriceRange);
    setSortBy(draftSortBy);
    setIsFilterOpen(false);
  };

  const clearAllFilters = () => {
    setDraftCategory('all');
    setDraftPriceRange('all');
    setDraftSortBy('default');
    setActiveCategory('all');
    setPriceRange('all');
    setSortBy('default');
    setSearchQuery('');
    setIsFilterOpen(false);
  };

  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (sortBy !== 'default' ? 1 : 0);

  const filtered = useMemo(() => {
    let list = activeCategory === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

    if (priceRange === 'under-2000') {
      list = list.filter((p) => p.price < 2000);
    } else if (priceRange === '2000-5000') {
      list = list.filter((p) => p.price >= 2000 && p.price <= 5000);
    } else if (priceRange === 'above-5000') {
      list = list.filter((p) => p.price > 5000);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q)) ||
          (p.purity && p.purity.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeCategory, priceRange, searchQuery, sortBy, allProducts]);

  return (
    <div className="collections-page">
      <SEO
        title={activeCategory !== 'all' ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection` : 'Silver Jewellery Collections'}
        description="Browse Kalrav Jewels 925 sterling silver rings, gemstone necklaces, bracelets, chains, and earrings. Certified hallmarked silver."
      />
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Kalrav Jewel</p>
          <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
          <h1 className="page-header__title">Our Collections</h1>
          <p className="page-header__subtitle">
            Discover pieces crafted with devotion, designed for eternity.
          </p>
        </div>
      </div>

      {/* Combined Filter & Scrollable Categories Bar */}
      <div className="filter-bar" id="filter-bar">
        <div className="container filter-bar__inner">
          <div className="filter-bar__left">
            <button className="filter-trigger-btn" onClick={openFilterDrawer} id="open-filters-btn">
              <svg className="filter-funnel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="filter-trigger-badge">{activeFilterCount}</span>
              )}
            </button>

            <div className="filter-bar__divider"></div>

            {/* Scrollable Category Tabs */}
            <div className="filter-bar__categories">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`filter-btn ${activeCategory === cat.slug ? 'filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat.slug)}
                  id={`filter-${cat.slug}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-bar__right">
            <span className="result-count-label">
              {filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>
        </div>
      </div>

      {/* Consolidated Filter Panel Drawer / Bottom Sheet */}
      {isFilterOpen && (
        <div className="filter-drawer-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="filter-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer__header">
              <div>
                <p className="filter-drawer__label">Refine Selection</p>
                <h3 className="filter-drawer__title">Filters & Sorting</h3>
              </div>
              <button className="filter-drawer__close" onClick={() => setIsFilterOpen(false)}>✕</button>
            </div>

            <div className="filter-drawer__body">
              {/* Category Group */}
              <div className="filter-group">
                <h4 className="filter-group__title">Category</h4>
                <div className="filter-chips">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      className={`filter-chip ${draftCategory === cat.slug ? 'filter-chip--active' : ''}`}
                      onClick={() => setDraftCategory(cat.slug)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Group */}
              <div className="filter-group">
                <h4 className="filter-group__title">Price Range</h4>
                <div className="filter-chips">
                  {priceRanges.map((p) => (
                    <button
                      key={p.slug}
                      className={`filter-chip ${draftPriceRange === p.slug ? 'filter-chip--active' : ''}`}
                      onClick={() => setDraftPriceRange(p.slug)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By Group */}
              <div className="filter-group">
                <h4 className="filter-group__title">Sort By</h4>
                <div className="filter-chips">
                  {sortOptions.map((s) => (
                    <button
                      key={s.slug}
                      className={`filter-chip ${draftSortBy === s.slug ? 'filter-chip--active' : ''}`}
                      onClick={() => setDraftSortBy(s.slug)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-drawer__footer">
              <button className="btn-outline" onClick={clearAllFilters} style={{ flex: 1 }}>
                <span>Clear All</span>
              </button>
              <button className="btn-primary" onClick={applyFilters} style={{ flex: 2 }}>
                <span>Apply ({filtered.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading collections...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '60px', color: '#c0392b' }}>{error}</p>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--charcoal)' }}>No pieces match your filters</p>
                  <p style={{ fontSize: '13px', color: 'var(--gray-mid)', marginTop: '8px', marginBottom: '24px' }}>Try selecting a different category or clearing active filters.</p>
                  <button className="btn-primary" onClick={clearAllFilters}><span>Clear All Filters</span></button>
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map((product) => {
                    const id = product._id || product.id;
                    const isFav = isInWishlist(id);

                    return (
                      <div key={id} className="product-card-wrap">
                        <Link
                          to={`/collections/${id}`}
                          className="product-card"
                          id={`product-${id}`}
                        >
                          <div className="product-card__image-wrap">
                            <img
                              src={product.images?.[0] || '/ring_product.webp'}
                              alt={product.name}
                              className="product-card__image"
                              loading="lazy"
                            />
                            {product.tags?.[0] && <span className="product-card__tag">{product.tags[0]}</span>}
                            <div className="product-card__hover-overlay">
                              <span className="product-card__hover-btn">View Details</span>
                            </div>
                          </div>
                          <div className="product-card__info">
                            <p className="product-card__category">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                            <h3 className="product-card__name">{product.name}</h3>
                            <div className="product-card__meta">
                              <span className="product-meta-item">{product.material}</span>
                              <span className="product-meta-dot"></span>
                              <span className="product-meta-item">{product.purity}</span>
                            </div>
                            <p className="product-card__price">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </Link>

                        {/* Wishlist Heart Button overlay */}
                        <button
                          className={`card-wishlist-btn ${isFav ? 'card-wishlist-btn--active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          aria-label="Toggle Wishlist"
                          title={isFav ? 'Remove from Wishlist' : 'Save to Wishlist'}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#c9a84c' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="collections-cta">
        <div className="container collections-cta__inner">
          <div>
            <p className="section-label">Bespoke Jewellery</p>
            <h3 className="collections-cta__title">Can't find what you're looking for?</h3>
          </div>
          <Link to="/contact" className="btn-primary" id="bespoke-cta-btn">
            <span>Request Custom Design</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Collections;
