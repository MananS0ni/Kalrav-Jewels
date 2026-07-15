import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Dynamically load the Razorpay script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

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
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

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
      if (paymentMethod === 'cod') {
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
        // Razorpay payment flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) throw new Error('Failed to load payment gateway. Check your internet connection.');

        // Create a Razorpay order on the backend
        const rzRes = await fetch(`${API}/payments/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ amount: totalPrice }),
        });
        const rzData = await rzRes.json();
        if (!rzRes.ok) throw new Error(rzData.message || 'Could not initiate payment');

        // Open Razorpay checkout popup
        const options = {
          key: rzData.key,
          amount: totalPrice * 100,
          currency: 'INR',
          name: 'Kalrav Jewels',
          description: `Order for ${items.length} item(s)`,
          order_id: rzData.orderId,
          prefill: {
            name: form.fullName,
            contact: form.phone,
            email: user?.email || '',
          },
          theme: { color: '#c9a84c' },

          handler: async (response) => {

            // Payment succeeded — verify signature then save order in DB
            const verifyRes = await fetch(`${API}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error('Payment verification failed');

            // Create order record in our DB with paymentId
            const orderRes = await fetch(`${API}/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
                shippingAddress: form,
                paymentMethod: 'razorpay',
                paymentId: verifyData.paymentId,
                paymentStatus: 'paid',
              }),
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || 'Order save failed');

            clearCart();
            navigate(`/order-confirmation/${orderData._id}`);
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setError('Payment was cancelled. You can try again.');
            },
          },
        };

        const rzpInstance = new window.Razorpay(options);
        rzpInstance.on('payment.failed', (resp) => {
          setError(`Payment failed: ${resp.error.description}`);
          setLoading(false);
        });
        rzpInstance.open();
        return; // Don't setLoading(false) here — modal is still open
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
                <label className={`payment-option ${paymentMethod === 'razorpay' ? 'payment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <div className="payment-option__content">
                    <p className="payment-option__title">Pay Online</p>
                    <p className="payment-option__sub">UPI · Credit/Debit Card · Net Banking · Wallets</p>
                  </div>
                  <span className="payment-option__badge">Recommended</span>
                </label>

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
            </div>

            <button type="submit" className="btn-primary checkout-btn" disabled={loading}>
              <span>
                {loading
                  ? 'Processing...'
                  : paymentMethod === 'razorpay'
                    ? `Pay Now — ${formatted(totalPrice)}`
                    : `Place Order — ${formatted(totalPrice)}`}
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
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-free">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-row--total">
              <span>Total</span>
              <span>{formatted(totalPrice)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
