import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import './Checkout.css';


const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');



const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // Default: UPI
  const [utrNumber, setUtrNumber] = useState('');            // Customer enters after paying
  const [upiStep, setUpiStep] = useState('select');          // 'select' | 'pay' | 'confirm'
  const [copied, setCopied] = useState(false);

  const UPI_ID = 'gpay-12203077109@okbizaxis';
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpiRedirect = () => {
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Kalrav+Jewels&am=${grandTotal.toFixed(2)}&tn=Kalrav+Jewels+Order&cu=INR`;
    window.location.href = upiLink;
  };


  // ── Live Shipping Calculation ─────────────────────────────────────────────
  const [shipping, setShipping] = useState(null);       // { total, baseCost, codFee, zone, isFree, breakdown, ... }
  const [shippingLoading, setShippingLoading] = useState(false);

  const fetchShipping = useCallback(async (pincode, method, subtotal) => {
    if (!/^\d{6}$/.test(pincode)) { setShipping(null); return; }
    setShippingLoading(true);
    try {
      const res = await fetch(`${API}/shipping/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemsTotal: subtotal, paymentMethod: method, pincode }),
      });
      const data = await res.json();
      if (res.ok) setShipping(data);
    } catch { /* silently fail — user can still submit */ }
    setShippingLoading(false);
  }, []);

  // Re-calculate whenever pincode or payment method changes
  useEffect(() => {
    fetchShipping(form.pincode, paymentMethod, totalPrice);
  }, [form.pincode, paymentMethod, totalPrice, fetchShipping]);

  const shippingCost = shipping ? shipping.total : 0;
  const grandTotal = totalPrice + shippingCost;

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Step 1: Save order in our DB, Step 2: Launch Razorpay
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form Validations
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!pinRegex.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'upi') {
        // UPI flow — place order with awaitingVerification status
        const res = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
            shippingAddress: form,
            paymentMethod: 'upi',
            utrNumber,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Order failed');
        clearCart();
        navigate(`/order-confirmation/${data._id}`);

      } else if (paymentMethod === 'cod') {
        // Cash on Delivery — directly create the order
        const res = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
            shippingAddress: form,
            paymentMethod: 'cod',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Order failed');
        clearCart();
        navigate(`/order-confirmation/${data._id}`);

      } else {
        throw new Error('Invalid payment method selected.');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="checkout-gate">
        <h2>Please sign in to checkout</h2>
        <Link to="/" className="btn-primary"><span>Go Home</span></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-gate">
        <h2>Your bag is empty</h2>
        <p>Add some items to your cart before checking out.</p>
        <Link to="/collections" className="btn-primary"><span>Browse Collections</span></Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-layout">

        {/* LEFT — Shipping Form */}
        <div className="checkout-form-section">
          <div className="checkout-header">
            <Link to="/collections" className="checkout-back">← Continue Shopping</Link>
            <p className="checkout-label">S E C U R E &nbsp; C H E C K O U T</p>
            <h1 className="checkout-title">Shipping Details</h1>
            <div className="gold-line"></div>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-field">
              <label>Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Manan Soni" />
            </div>
            <div className="checkout-field">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" type="tel" />
            </div>
            <div className="checkout-field checkout-field--full">
              <label>Address *</label>
              <input name="addressLine" value={form.addressLine} onChange={handleChange} required placeholder="123, Silver Lane, Main Road" />
            </div>
            <div className="checkout-row">
              <div className="checkout-field">
                <label>City *</label>
                <input name="city" value={form.city} onChange={handleChange} required placeholder="Ahmedabad" />
              </div>
              <div className="checkout-field">
                <label>State *</label>
                <input name="state" value={form.state} onChange={handleChange} required placeholder="Gujarat" />
              </div>
              <div className="checkout-field">
                <label>Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="380001" />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="checkout-payment-info">
              <p className="checkout-payment-label">Payment Method</p>
              <div className="payment-options">

                {/* UPI — Primary option */}
                <label className={`payment-option ${paymentMethod === 'upi' ? 'payment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => { setPaymentMethod('upi'); setUpiStep('select'); }}
                  />
                  <div className="payment-option__content">
                    <p className="payment-option__title">Pay via UPI</p>
                    <p className="payment-option__sub">GPay · PhonePe · Paytm · Any UPI App</p>
                  </div>
                  <span className="payment-option__badge">Recommended</span>
                </label>

                {/* COD */}
                <label className={`payment-option ${paymentMethod === 'cod' ? 'payment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-option__content">
                    <p className="payment-option__title">Cash on Delivery</p>
                    <p className="payment-option__sub">Pay when your order arrives</p>
                  </div>
                </label>


              </div>

              {/* UPI payment panel — shown when UPI is selected */}
              {paymentMethod === 'upi' && (
                <div className="upi-panel">
                  <div className="upi-panel__top">
                    <div className="upi-panel__qr-wrap" style={{ width: '100%' }}>
                      <p className="upi-panel__step">Step 1 — Scan & Pay</p>
                      <div className="upi-panel__qr-box">
                        {/* Dynamic QR generated with exact amount (Offline local SVG rendering) */}
                      {grandTotal > 0 && (() => {
                          const upiLink = `upi://pay?pa=${UPI_ID}&pn=Kalrav+Jewels&am=${grandTotal.toFixed(2)}&tn=Kalrav+Jewels+Order&cu=INR`;
                          return (
                            <QRCodeSVG
                              value={upiLink}
                              size={200}
                              bgColor="#ffffff"
                              fgColor="#1a1a1a"
                              level="M"
                              includeMargin={true}
                              className="upi-panel__qr-img"
                            />
                          );
                        })()}
                      </div>

                      {/* Pay Now button — Android opens UPI app, iPhone sees fallback */}
                      {!isIOS ? (
                        <button
                          type="button"
                          onClick={handleUpiRedirect}
                          className="upi-panel__pay-btn"
                          style={{ marginTop: '12px', width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '12px', fontFamily: "'Georgia', serif", fontSize: '14px', letterSpacing: '1px', cursor: 'pointer' }}
                        >
                          Open UPI App & Pay {formatted(grandTotal)}
                        </button>
                      ) : (
                        <div style={{ marginTop: '14px', width: '100%' }}>
                          <p style={{ fontSize: '12px', color: '#6b6b6b', textAlign: 'center', marginBottom: '12px', lineHeight: '1.5' }}>
                            Tap your preferred UPI app to pay
                          </p>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button type="button" onClick={() => {
                              handleCopyUpi();
                              window.location.href = `gpay://upi/pay?pa=${UPI_ID}&pn=Kalrav+Jewels&am=${grandTotal.toFixed(2)}&tn=Kalrav+Jewels+Order&cu=INR`;
                            }}
                              style={{ flex: 1, padding: '12px 6px', background: '#fff', border: '1px solid #e0d6c2', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '20px' }}>💳</span> GPay
                            </button>
                            <button type="button" onClick={() => {
                              handleCopyUpi();
                              window.location.href = `phonepe://pay?pa=${UPI_ID}&pn=Kalrav+Jewels&am=${grandTotal.toFixed(2)}&tn=Kalrav+Jewels+Order&cu=INR`;
                            }}
                              style={{ flex: 1, padding: '12px 6px', background: '#fff', border: '1px solid #e0d6c2', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '20px' }}>📱</span> PhonePe
                            </button>
                            <button type="button" onClick={() => {
                              handleCopyUpi();
                              window.location.href = `paytmmp://pay?pa=${UPI_ID}&pn=Kalrav+Jewels&am=${grandTotal.toFixed(2)}&tn=Kalrav+Jewels+Order&cu=INR`;
                            }}
                              style={{ flex: 1, padding: '12px 6px', background: '#fff', border: '1px solid #e0d6c2', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '20px' }}>💰</span> Paytm
                            </button>
                          </div>
                          <p style={{ fontSize: '10px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
                            Amount {formatted(grandTotal)} pre-filled · UPI ID also copied to clipboard
                          </p>
                        </div>
                      )}
                      <div className="upi-panel__id-copy-row" style={{ marginTop: '14px' }}>
                        <p className="upi-panel__upi-id">UPI ID: <strong>{UPI_ID}</strong></p>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="upi-panel__copy-btn"
                          title="Copy UPI ID"
                        >
                          {copied ? 'Copied! ✓' : 'Copy ID'}
                        </button>
                      </div>
                      <p className="upi-panel__amount" style={{ marginTop: '8px' }}>Amount: <strong>{formatted(grandTotal)}</strong></p>
                    </div>
                  </div>


                  <div className="upi-panel__utr">
                    <p className="upi-panel__step">Step 2 — Enter Your UPI ID or UTR</p>
                    <p className="upi-panel__utr-hint">After paying, please enter your UPI ID (e.g. yourname@bank) or the 12-digit transaction UTR so we can verify your payment.</p>
                    <input
                      type="text"
                      className="form-input upi-utr-input"
                      placeholder="e.g. rahul@okhdfcbank or 4269..."
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.trim())}
                      maxLength={50}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary checkout-btn"
              disabled={loading || (paymentMethod === 'upi' && !utrNumber)}
            >
              <span>
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'upi'
                    ? utrNumber ? `Confirm UPI Order — ${formatted(grandTotal)}` : 'Pay first, then enter UPI ID below'
                    : `Place Order — ${formatted(grandTotal)}`}
              </span>
            </button>
          </form>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-divider"></div>

            <ul className="summary-items">
              {items.map((item) => (
                <li key={item.productId} className="summary-item">
                  <div className="summary-item__img-wrap">
                    <img src={item.image} alt={item.name} className="summary-item__img" />
                    <span className="summary-item__qty-badge">{item.qty}</span>
                  </div>
                  <div className="summary-item__info">
                    <p className="summary-item__name">{item.name}</p>
                    <p className="summary-item__meta">{item.material} · {item.purity}</p>
                  </div>
                  <p className="summary-item__price">{formatted(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatted(totalPrice)}</span>
            </div>

            {/* Shipping Breakdown */}
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shippingLoading && <span className="summary-shipping-loading">Calculating...</span>}
                {!shippingLoading && !shipping && (
                  <span className="summary-shipping-hint">Enter pincode</span>
                )}
                {!shippingLoading && shipping && (
                  shipping.isFree
                    ? <span className="summary-shipping-free">FREE</span>
                    : formatted(shipping.total)
                )}
              </span>
            </div>

            {/* COD fee detail line */}
            {!shippingLoading && shipping && !shipping.isFree && shipping.codFee > 0 && (
              <div className="summary-row summary-row--sub">
                <span>COD Handling Fee</span>
                <span>+{formatted(shipping.codFee)}</span>
              </div>
            )}

            {/* Free shipping nudge */}
            {!shippingLoading && shipping && !shipping.isFree && shipping.amountForFreeShipping > 0 && (
              <div className="summary-free-nudge">
                Add {formatted(shipping.amountForFreeShipping)} more for FREE shipping
              </div>
            )}

            <div className="summary-divider"></div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatted(grandTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
