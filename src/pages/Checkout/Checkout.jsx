import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Checkout.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // If not logged in, redirect
  if (!user) {
    return (
      <div className="checkout-gate">
        <h2>Please sign in to checkout</h2>
        <Link to="/" className="btn-primary"><span>Go Home</span></Link>
      </div>
    );
  }

  // If cart empty
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

            <div className="checkout-payment-info">
              <p className="checkout-payment-label">Payment Method</p>
              <div className="checkout-cod-badge">
                <span className="cod-icon">💳</span>
                <div>
                  <p className="cod-title">Cash on Delivery</p>
                  <p className="cod-sub">Pay when your order arrives</p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary checkout-btn" disabled={loading}>
              <span>{loading ? 'Placing Order...' : `Place Order — ${formatted(totalPrice)}`}</span>
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
