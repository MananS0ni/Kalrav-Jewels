import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const stats = [
  { value: '3', label: 'Generations of Trust' },
  { value: 'Family', label: 'Owned & Operated' },
  { value: '100%', label: 'Authentic Craftsmanship' },
  { value: '925', label: 'Sterling Silver' },
];

const categories = [
  { name: 'Rings', slug: 'rings', desc: 'Eternities & Solitaires', image: '/ring_product.png' },
  { name: 'Necklaces', slug: 'necklaces', desc: 'Sets & Pendants', image: '/necklace_product.png' },
  { name: 'Earrings', slug: 'earrings', desc: 'Drops & Studs', image: '/earring_product.png' },
  { name: 'Bracelets', slug: 'bracelets', desc: 'Tennis & Bangles', image: '/bracelet_product.png' },
  { name: 'Chains', slug: 'chains', desc: 'Link & Snake', image: '/silver-link-chain/hero-1.jpg' },
];

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);

    fetch(`${API}/products?featured=true`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load featured products', err);
        setLoading(false);
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home">
      {/* ─── Hero ─── */}
      <section className={`hero ${heroVisible ? 'hero--visible' : ''}`} id="hero-section">
        <div className="hero__bg">
          <img src="/hero_jewelry.png" alt="NH Soni Jewellers luxury jewelry collection" className="hero__img" />
          <div className="hero__overlay"></div>
        </div>
        <div className="hero__content container">
          <div className="hero__text-wrap">
            <p className="hero__label section-label">A Family Legacy</p>
            <h1 className="hero__title">
              Where Silver Meets<br />
              <em>Timeless Grace</em>
            </h1>
            <div className="hero__line"></div>
            <p className="hero__subtitle">
              Handcrafted 925 sterling silver jewellery celebrating India's most cherished moments.<br />
              Every piece, a legacy.
            </p>
            <div className="hero__actions">
              <Link to="/collections" className="btn-primary" id="hero-explore-btn">
                <span>Explore Collections</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span className="scroll-line"></span>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* ─── Marquee Strip ─── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {['925 Sterling Silver', 'Hallmarked Jewellery', 'Handcrafted Designs', 'Custom Orders Welcome', 'Free Home Delivery', 'Lifetime Maintenance', '925 Sterling Silver', 'Hallmarked Jewellery', 'Handcrafted Designs', 'Custom Orders Welcome', 'Free Home Delivery', 'Lifetime Maintenance'].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot"></span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Categories ─── */}
      <section className="categories" id="categories-section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Shop by Category</p>
            <div className="gold-line"></div>
            <h2 className="section-title">Our Collections</h2>
            <p className="section-subtitle" style={{ maxWidth: '480px', margin: '12px auto 0' }}>
              From heirlooms to statement pieces — discover jewellery for every occasion.
            </p>
          </div>

          <div className="categories__grid">
            {categories.map((cat) => (
              <Link
                to={`/collections?category=${cat.slug}`}
                key={cat.slug}
                className="category-card"
                id={`category-${cat.slug}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="category-card__hover-img"
                  loading="lazy"
                />
                <div className="category-card__inner">
                  <h3 className="category-card__name">{cat.name}</h3>
                  <span className="category-card__cta">View All</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="featured" id="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Handpicked for You</p>
            <div className="gold-line"></div>
            <h2 className="section-title">Featured Pieces</h2>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading featured pieces...</p>
          ) : (
            <div className="featured__grid">
              {featuredProducts.map((product) => (
                <Link
                  to={`/collections/${product._id}`}
                  key={product._id}
                  className="product-card"
                  id={`product-card-${product._id}`}
                >
                  <div className="product-card__image-wrap">
                    <img
                      src={product.images?.[0] || '/ring_product.png'}
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
                    <p className="product-card__price">₹{product.price?.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="featured__cta">
            <Link to="/collections" className="btn-outline" id="view-all-btn">View All Collections</Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="stats" id="stats-section">
        <div className="container stats__grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-divider"></span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
