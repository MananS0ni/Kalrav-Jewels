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

const Collections = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => { setAllProducts(data); setLoading(false); })
      .catch(() => { setError('Failed to load products.'); setLoading(false); });
  }, []);

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

      {/* Filter Bar */}
      <div className="filter-bar" id="filter-bar">
        <div className="container filter-bar__inner">
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

          {/* Price & Sorting Bar */}
          <div className="filter-bar__controls">

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="sort-select"
            >
              {priceRanges.map((p) => (
                <option key={p.slug} value={p.slug}>{p.label}</option>
              ))}
            </select>

            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sort By: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="products-section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading collections...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '60px', color: '#c0392b' }}>{error}</p>
          ) : (
            <>
              <div className="products-grid-header">
                <p className="product-count">{filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}</p>
                {(activeCategory !== 'all' || priceRange !== 'all' || searchQuery) && (
                  <button
                    className="reset-filters-btn"
                    onClick={() => {
                      setActiveCategory('all');
                      setPriceRange('all');
                      setSearchQuery('');
                      setSortBy('default');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="no-products">
                  <p>No pieces match your search criteria.</p>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      setActiveCategory('all');
                      setPriceRange('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </button>
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
