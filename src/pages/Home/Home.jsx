import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const products = [
  {
    id: 1,
    name: 'Diamond Solitaire Ring',
    category: 'Rings',
    price: '₹1,85,000',
    image: '/ring_product.png',
    tag: 'Bestseller',
  },
  {
    id: 2,
    name: 'Royal Gold Necklace',
    category: 'Necklaces',
    price: '₹3,20,000',
    image: '/necklace_product.png',
    tag: 'New Arrival',
  },
  {
    id: 3,
    name: 'Diamond Drop Earrings',
    category: 'Earrings',
    price: '₹98,000',
    image: '/earring_product.png',
    tag: 'Exquisite',
  },
  {
    id: 4,
    name: 'Gold Tennis Bracelet',
    category: 'Bracelets',
    price: '₹2,45,000',
    image: '/bracelet_product.png',
    tag: 'Signature',
  },
];

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

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
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
                  <p className="category-card__desc">{cat.desc}</p>
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

          <div className="featured__grid">
            {products.map((product) => (
              <Link
                to={`/collections/${product.id}`}
                key={product.id}
                className="product-card"
                id={`product-card-${product.id}`}
              >
                <div className="product-card__image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                  />
                  <span className="product-card__tag">{product.tag}</span>
                  <div className="product-card__hover-overlay">
                    <span className="product-card__hover-btn">View Details</span>
                  </div>
                </div>
                <div className="product-card__info">
                  <p className="product-card__category">{product.category}</p>
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__price">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

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
