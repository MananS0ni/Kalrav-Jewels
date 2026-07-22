import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

const Collections = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy] = useState('default');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeCategory, sortBy, allProducts]);

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

          <div className="filter-bar__sort">
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
              <p className="product-count">{filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}</p>
              {filtered.length === 0 ? (
                <div className="no-products">
                  <p>No pieces found in this category.</p>
                  <button className="btn-outline" onClick={() => setActiveCategory('all')}>
                    View All Collections
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map((product) => (
                    <Link
                      to={`/collections/${product._id}`}
                      key={product._id}
                      className="product-card"
                      id={`product-${product._id}`}
                    >
                      <div className="product-card__image-wrap">
                        <img
                          src={product.images[0] || '/ring_product.webp'}
                          alt={product.name}
                          className="product-card__image"
                          loading="lazy"
                        />
                        {product.tags[0] && <span className="product-card__tag">{product.tags[0]}</span>}
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
                  ))}
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
