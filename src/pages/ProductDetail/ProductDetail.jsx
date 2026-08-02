import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import SEO from '../../components/SEO/SEO';
import './ProductDetail.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const INDIAN_RING_SIZES = [
  { size: '6', diameter: 14.5, circ: 45.5, us: '3.5' },
  { size: '7', diameter: 14.9, circ: 46.8, us: '4.0' },
  { size: '8', diameter: 15.3, circ: 48.0, us: '4.5' },
  { size: '9', diameter: 15.7, circ: 49.3, us: '5.0' },
  { size: '10', diameter: 16.1, circ: 50.6, us: '5.5' },
  { size: '11', diameter: 16.5, circ: 51.8, us: '6.0' },
  { size: '12', diameter: 16.9, circ: 53.1, us: '6.5' },
  { size: '13', diameter: 17.3, circ: 54.4, us: '7.0' },
  { size: '14', diameter: 17.7, circ: 55.6, us: '7.5' },
  { size: '15', diameter: 18.1, circ: 56.9, us: '8.0' },
  { size: '16', diameter: 18.5, circ: 58.2, us: '8.5' },
  { size: '17', diameter: 19.0, circ: 59.5, us: '9.0' },
  { size: '18', diameter: 19.3, circ: 60.7, us: '9.5' },
  { size: '19', diameter: 19.7, circ: 62.0, us: '10.0' },
  { size: '20', diameter: 20.1, circ: 63.3, us: '10.5' },
  { size: '21', diameter: 20.5, circ: 64.5, us: '11.0' },
  { size: '22', diameter: 20.9, circ: 65.8, us: '11.5' },
  { size: '23', diameter: 21.3, circ: 67.1, us: '12.0' },
  { size: '24', diameter: 21.7, circ: 68.3, us: '12.5' },
  { size: '25', diameter: 22.1, circ: 69.6, us: '13.0' },
];

const getIndianRingSizeFromMm = (mm) => {
  if (!mm || isNaN(mm)) return null;
  const val = parseFloat(mm);
  let closest = INDIAN_RING_SIZES[0];
  let minDiff = Math.abs(val - INDIAN_RING_SIZES[0].circ);
  for (const item of INDIAN_RING_SIZES) {
    const diff = Math.abs(val - item.circ);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }
  return closest;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquirySent, setEnquirySent] = useState(false);
  const [sendingEnquiry, setSendingEnquiry] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const [sizerOpen, setSizerOpen] = useState(false);
  const [sizerTab, setSizerTab] = useState('calculator'); // 'calculator' | 'chart'
  const [circumference, setCircumference] = useState('');
  const [selectedRingSize, setSelectedRingSize] = useState('12'); // Default Indian Size 12
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveMediaIndex(0);
        return fetch(`${API}/products?category=${data.category}`);
      })
      .then((res) => res.json())
      .then((data) => setRelated(data.filter((p) => p._id !== id).slice(0, 3)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const calcResult = circumference ? getIndianRingSizeFromMm(circumference) : null;
  const categoryLower = (product?.category || '').toLowerCase();
  const nameLower = (product?.name || '').toLowerCase();
  const isRing = (categoryLower === 'rings' || /\brings?\b/i.test(nameLower)) && !categoryLower.includes('earring') && !nameLower.includes('earring');
  const activeRingObj = INDIAN_RING_SIZES.find((s) => s.size === selectedRingSize) || INDIAN_RING_SIZES[6];

  const handleAddToCart = () => {
    const sizeLabel = isRing ? `Size ${selectedRingSize}` : '';
    addToCart(product, sizeLabel);
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

  const handleEnquiry = async (e) => {
    e.preventDefault();
    const name = e.target.elements['enquiry-name'].value;
    const phone = e.target.elements['enquiry-phone'].value;

    setSendingEnquiry(true);
    try {
      const res = await fetch(`${API}/contact/enquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          productName: isRing ? `${product.name} (Size ${selectedRingSize})` : product.name
        }),
      });
      if (res.ok) {
        setEnquirySent(true);
      } else {
        alert('Failed to send enquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setSendingEnquiry(false);
    }
  };

  return (
    <div className="product-detail">
      <SEO
        title={product.name}
        description={`Buy ${product.name} at Kalrav Jewels. ${product.description || 'Handcrafted 925 hallmarked sterling silver jewellery.'} Price: ₹${product.price?.toLocaleString('en-IN')}`}
        image={product.image || product.images?.[0]}
      />
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
                src={product.images?.[activeMediaIndex] || '/ring_product.webp'}
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
                    <img src={media} alt={`Thumbnail ${idx + 1}`} className="thumbnail-img" />
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

          {product.description && product.description.trim().length > 3 && (
            <p className="product-detail__desc">{product.description}</p>
          )}

          <div className="product-detail__specs">
            {product.material && (
              <div className="spec-row">
                <span className="spec-key">Material</span>
                <span className="spec-val">{product.material}</span>
              </div>
            )}
            {product.weight && (
              <div className="spec-row">
                <span className="spec-key">Weight</span>
                <span className="spec-val">{product.weight}</span>
              </div>
            )}
            {product.purity && (
              <div className="spec-row">
                <span className="spec-key">Purity / Stone</span>
                <span className="spec-val">{product.purity}</span>
              </div>
            )}
            <div className="spec-row">
              <span className="spec-key">Certification</span>
              <span className="spec-val">BIS Hallmarked 925 Silver</span>
            </div>
          </div>

          {/* Ring Size Selector — only for rings */}
          {isRing && (
            <div className="ring-size-section">
              <div className="ring-size-header">
                <div className="ring-size-header__left">
                  <span className="ring-size-title">Select Ring Size</span>
                  <span className="ring-size-badge">Standard Size</span>
                </div>
                <button
                  type="button"
                  className="ring-sizer-trigger"
                  onClick={() => setSizerOpen(true)}
                  id="ring-sizer-trigger"
                >
                  <span>📏 Size Guide</span>
                </button>
              </div>

              <div className="ring-size-grid">
                {INDIAN_RING_SIZES.map((item) => (
                  <button
                    key={item.size}
                    type="button"
                    className={`ring-size-pill ${selectedRingSize === item.size ? 'ring-size-pill--active' : ''}`}
                    onClick={() => setSelectedRingSize(item.size)}
                  >
                    <span>{item.size}</span>
                  </button>
                ))}
              </div>

              <p className="ring-size-info">
                Selected: <strong>Size {activeRingObj.size}</strong> ({activeRingObj.diameter} inner diameter · {activeRingObj.us} US equivalent)
              </p>
            </div>
          )}

          {/* Add to Cart */}
          <button
            className={`btn-primary add-to-cart-btn ${added ? 'add-to-cart-btn--added' : ''}`}
            onClick={handleAddToCart}
            id="add-to-cart-btn"
          >
            <span>{added ? '✓ Added to Bag' : `Add to Bag ${isRing ? `(Size ${selectedRingSize})` : ''}`}</span>
          </button>

          {/* Enquiry Form */}
          {!enquirySent ? (
            <form className="enquiry-form" onSubmit={handleEnquiry} id="enquiry-form">
              <p className="enquiry-form__title">Enquire About This Piece</p>
              <input
                type="text"
                name="enquiry-name"
                placeholder="Your Name"
                required
                className="form-input"
                id="enquiry-name"
              />
              <input
                type="tel"
                name="enquiry-phone"
                placeholder="Phone Number"
                required
                className="form-input"
                id="enquiry-phone"
              />
              <button type="submit" className="btn-primary" id="enquiry-submit-btn" style={{ width: '100%' }} disabled={sendingEnquiry}>
                <span>{sendingEnquiry ? 'Sending...' : 'Request a Callback'}</span>
              </button>
            </form>
          ) : (
            <div className="enquiry-success" id="enquiry-success">
              <p className="enquiry-success__msg">
                Thank you. Our team will reach out to you shortly regarding <strong>{product.name}</strong> {isRing ? `(Size ${selectedRingSize})` : ''}.
              </p>
            </div>
          )}

          <div className="product-detail__assurances">
            {['Pan-India Delivery', 'Lifetime Maintenance', 'Easy Exchange Policy', 'BIS Certified'].map((a, i) => (
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
                  <img src={p.images?.[0] || '/ring_product.webp'} alt={p.name} className="product-card__image" loading="lazy" />
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

      {/* Comprehensive Ring Size Calculator & Chart Modal */}
      {sizerOpen && (
        <div className="sizer-overlay" id="sizer-overlay" onClick={() => setSizerOpen(false)}>
          <div className="sizer-modal sizer-modal--wide" onClick={(e) => e.stopPropagation()}>
            <button className="sizer-modal__close" onClick={() => setSizerOpen(false)} aria-label="Close">✕</button>

            <p className="sizer-modal__label">Size Guide</p>
            <div className="gold-line" style={{ marginTop: '8px', marginBottom: '16px' }}></div>
            <h2 className="sizer-modal__title">Ring Size Guide</h2>
            <p className="sizer-modal__subtitle">
              Kalrav Jewels uses standard ring sizes (Sizes 6 to 25). Use our calculator or conversion chart below.
            </p>

            {/* Navigation Tabs */}
            <div className="sizer-modal-tabs">
              <button
                type="button"
                className={`sizer-tab ${sizerTab === 'calculator' ? 'sizer-tab--active' : ''}`}
                onClick={() => setSizerTab('calculator')}
              >
                🧮 Finger mm Calculator
              </button>
              <button
                type="button"
                className={`sizer-tab ${sizerTab === 'chart' ? 'sizer-tab--active' : ''}`}
                onClick={() => setSizerTab('chart')}
              >
                📊 Size Chart (6 - 25)
              </button>
            </div>

            {sizerTab === 'calculator' && (
              <div className="sizer-calculator-body">
                <div className="sizer-input-wrap">
                  <label className="sizer-label" htmlFor="sizer-input">Finger Circumference (mm)</label>
                  <input
                    id="sizer-input"
                    type="number"
                    min="40"
                    max="76"
                    placeholder="e.g. 53"
                    className="sizer-input"
                    value={circumference}
                    onChange={(e) => setCircumference(e.target.value)}
                  />
                </div>

                {calcResult && (
                  <div className="sizer-result">
                    <div className="sizer-result__num">
                      <span className="sizer-result__size">{calcResult.size}</span>
                      <span className="sizer-result__sub">Ring Size</span>
                    </div>
                    <div className="sizer-result__details">
                      <p><strong>Inner Diameter:</strong> {calcResult.diameter}</p>
                      <p><strong>Circumference:</strong> {calcResult.circ}</p>
                      <p><strong>US Size Equivalent:</strong> {calcResult.us}</p>
                    </div>
                    <button
                      type="button"
                      className="sizer-result__select-btn"
                      onClick={() => {
                        setSelectedRingSize(calcResult.size);
                        setSizerOpen(false);
                      }}
                    >
                      Select Size {calcResult.size}
                    </button>
                  </div>
                )}

                <div className="sizer-steps">
                  <div className="sizer-step"><span className="sizer-step__num">01</span><span>Cut a strip of paper or non-stretching string</span></div>
                  <div className="sizer-step"><span className="sizer-step__num">02</span><span>Wrap it snugly around the base of your ring finger</span></div>
                  <div className="sizer-step"><span className="sizer-step__num">03</span><span>Mark where the paper overlaps and measure with a ruler in mm</span></div>
                  <div className="sizer-step"><span className="sizer-step__num">04</span><span>Enter the mm measurement above to get your exact Ring Size</span></div>
                </div>
              </div>
            )}

            {sizerTab === 'chart' && (
              <div className="sizer-chart-wrap">
                <table className="sizer-table">
                  <thead>
                    <tr>
                      <th>Ring Size</th>
                      <th>Inner Diameter (mm)</th>
                      <th>Circumference (mm)</th>
                      <th>US Size</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INDIAN_RING_SIZES.map((row) => (
                      <tr key={row.size} className={selectedRingSize === row.size ? 'sizer-table-row--selected' : ''}>
                        <td><strong>Size {row.size}</strong></td>
                        <td>{row.diameter}</td>
                        <td>{row.circ}</td>
                        <td>US {row.us}</td>
                        <td>
                          <button
                            type="button"
                            className="sizer-table-btn"
                            onClick={() => {
                              setSelectedRingSize(row.size);
                              setSizerOpen(false);
                            }}
                          >
                            {selectedRingSize === row.size ? 'Selected ✓' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="sizer-note">Need expert assistance? Call or WhatsApp our jewellery team — <a href="https://wa.me/919537068100" target="_blank" rel="noreferrer" className="sizer-note__link">+91 95370 68100</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
