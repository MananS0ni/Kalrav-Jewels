import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquirySent, setEnquirySent] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const [sizerOpen, setSizerOpen] = useState(false);
  const [circumference, setCircumference] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveMediaIndex(0); // Reset gallery on product change
        // fetch related (same category)
        return fetch(`${API}/products?category=${data.category}`);
      })
      .then((res) => res.json())
      .then((data) => setRelated(data.filter((p) => p._id !== id).slice(0, 3)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const getRingSize = (mm) => {
    const sizes = [
      { max: 44, size: '6', label: 'XS — Petite' },
      { max: 46, size: '7', label: 'S — Slender' },
      { max: 48, size: '8', label: 'S-M — Fine' },
      { max: 50, size: '9', label: 'M — Classic' },
      { max: 52, size: '10', label: 'M — Elegant' },
      { max: 54, size: '11', label: 'M-L — Graceful' },
      { max: 56, size: '12', label: 'L — Regal' },
      { max: 58, size: '13', label: 'L — Bold' },
      { max: 60, size: '14', label: 'XL — Grand' },
      { max: Infinity, size: '15+', label: 'XL — Majestic' },
    ];
    return sizes.find((s) => mm <= s.max);
  };

  const result = circumference ? getRingSize(parseFloat(circumference)) : null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!product || product.message) return (
    <div className="not-found-wrap">
      <h2>Product not found</h2>
      <Link to="/collections" className="btn-primary"><span>Back to Collections</span></Link>
    </div>
  );

  const handleEnquiry = (e) => {
    e.preventDefault();
    setEnquirySent(true);
  };

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb" id="breadcrumb">
        <div className="container breadcrumb__inner">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <Link to="/collections" className="breadcrumb__link">Collections</Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container product-detail__main">
        {/* Image */}
        <div className="product-detail__gallery">
          <div className="product-detail__image-wrap">
            {product.images?.[activeMediaIndex]?.endsWith('.mp4') ? (
              <video 
                src={product.images[activeMediaIndex]} 
                autoPlay loop muted playsInline 
                className="product-detail__image" 
              />
            ) : (
              <img 
                src={product.images?.[activeMediaIndex] || '/ring_product.png'} 
                alt={product.name} 
                className="product-detail__image" 
              />
            )}
            {product.tags?.[0] && <span className="product-detail__tag">{product.tags[0]}</span>}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="product-detail__thumbnails">
              {product.images.map((media, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail-btn ${idx === activeMediaIndex ? 'active' : ''}`}
                  onClick={() => setActiveMediaIndex(idx)}
                >
                  {media.endsWith('.mp4') ? (
                    <video src={media} muted className="thumbnail-img" />
                  ) : (
                    <img src={media} alt={`Thumbnail ${idx+1}`} className="thumbnail-img" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-detail__info">
          <p className="product-detail__category section-label">{product.category}</p>
          <div className="gold-line" style={{ marginTop: '12px' }}></div>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">₹{product.price?.toLocaleString('en-IN')}</p>

          <p className="product-detail__desc">{product.description}</p>

          <div className="product-detail__specs">
            <div className="spec-row">
              <span className="spec-key">Material</span>
              <span className="spec-val">{product.material}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Weight</span>
              <span className="spec-val">{product.weight}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Purity / Stone</span>
              <span className="spec-val">{product.purity}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">Certification</span>
              <span className="spec-val">BIS Hallmarked</span>
            </div>
          </div>

          {/* Ring Size Trigger — only for rings */}
          {product.category === 'rings' && (
            <button
              className="ring-sizer-trigger"
              onClick={() => setSizerOpen(true)}
              id="ring-sizer-trigger"
            >
              <span className="ring-sizer-trigger__icon">◈</span>
              <span className="ring-sizer-trigger__text">Discover Your Perfect Size</span>
              <span className="ring-sizer-trigger__arrow">→</span>
            </button>
          )}

          {/* Add to Cart */}
          <button
            className={`btn-primary add-to-cart-btn ${added ? 'add-to-cart-btn--added' : ''}`}
            onClick={handleAddToCart}
            id="add-to-cart-btn"
          >
            <span>{added ? '✓ Added to Bag' : 'Add to Bag'}</span>
          </button>

          {/* Enquiry Form */}
          {!enquirySent ? (
            <form className="enquiry-form" onSubmit={handleEnquiry} id="enquiry-form">
              <p className="enquiry-form__title">Enquire About This Piece</p>
              <input
                type="text"
                placeholder="Your Name"
                required
                className="form-input"
                id="enquiry-name"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                className="form-input"
                id="enquiry-phone"
              />
              <button type="submit" className="btn-primary" id="enquiry-submit-btn" style={{ width: '100%' }}>
                <span>Request a Callback</span>
              </button>
            </form>
          ) : (
            <div className="enquiry-success" id="enquiry-success">
              <p className="enquiry-success__msg">
                Thank you. Our team will reach out to you shortly regarding <strong>{product.name}</strong>.
              </p>
            </div>
          )}

          <div className="product-detail__assurances">
            {['Free Home Delivery', 'Lifetime Maintenance', 'Easy Exchange Policy', 'BIS Certified'].map((a, i) => (
              <span key={i} className="assurance-badge">{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left' }}>
            <p className="section-label">You May Also Like</p>
            <div className="gold-line" style={{ margin: '14px 0' }}></div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Related Pieces</h2>
          </div>
          <div className="related-grid">
            {related.map((p) => (
              <Link
                to={`/collections/${p._id}`}
                key={p._id}
                className="product-card"
                id={`related-${p._id}`}
              >
                <div className="product-card__image-wrap">
                  <img src={p.images?.[0] || '/ring_product.png'} alt={p.name} className="product-card__image" loading="lazy" />
                  {p.tags?.[0] && <span className="product-card__tag">{p.tags[0]}</span>}
                  <div className="product-card__hover-overlay">
                    <span className="product-card__hover-btn">View Details</span>
                  </div>
                </div>
                <div className="product-card__info" style={{ padding: '16px 4px 0' }}>
                  <p className="product-card__category">{p.category}</p>
                  <h3 className="product-card__name">{p.name}</h3>
                  <p className="product-card__price">₹{p.price?.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Ring Size Calculator Modal */}
      {sizerOpen && (
        <div className="sizer-overlay" id="sizer-overlay" onClick={() => setSizerOpen(false)}>
          <div className="sizer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sizer-modal__close" onClick={() => setSizerOpen(false)} aria-label="Close">✕</button>

            <p className="sizer-modal__label">Ring Size Guide</p>
            <div className="gold-line" style={{ marginTop: '10px', marginBottom: '20px' }}></div>
            <h2 className="sizer-modal__title">Find Your Perfect Fit</h2>
            <p className="sizer-modal__subtitle">
              Wrap a thin strip of paper around your finger. Mark where it meets and measure the length in millimetres.
            </p>

            <div className="sizer-input-wrap">
              <label className="sizer-label" htmlFor="sizer-input">Finger Circumference (mm)</label>
              <input
                id="sizer-input"
                type="number"
                min="40"
                max="76"
                placeholder="e.g. 52"
                className="sizer-input"
                value={circumference}
                onChange={(e) => setCircumference(e.target.value)}
              />
            </div>

            {result && (
              <div className="sizer-result">
                <span className="sizer-result__size">{result.size}</span>
                <span className="sizer-result__label">{result.label}</span>
                <p className="sizer-result__hint">Indian Ring Size · {circumference} mm circumference</p>
              </div>
            )}

            <div className="sizer-steps">
              <div className="sizer-step"><span className="sizer-step__num">01</span><span>Cut a thin strip of paper or thread</span></div>
              <div className="sizer-step"><span className="sizer-step__num">02</span><span>Wrap snugly around your ring finger</span></div>
              <div className="sizer-step"><span className="sizer-step__num">03</span><span>Mark the overlap point & measure in mm</span></div>
              <div className="sizer-step"><span className="sizer-step__num">04</span><span>Enter the measurement above</span></div>
            </div>

            <p className="sizer-note">Not sure? Our team can help you over a call — <a href="tel:+919537068100" className="sizer-note__link">+91 95370 68100</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
