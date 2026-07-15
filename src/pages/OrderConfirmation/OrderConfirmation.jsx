import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderConfirmation.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  useEffect(() => {
    fetch(`${API}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId, token]);

  if (loading) return <div className="oc-loading">Loading order...</div>;
  if (!order || order.message) return (
    <div className="oc-gate">
      <h2>Order not found</h2>
      <Link to="/" className="btn-primary"><span>Go Home</span></Link>
    </div>
  );

  return (
    <div className="oc-page">
      <div className="container oc-layout">

        {/* Success Header */}
        <div className="oc-hero">
          <div className="oc-check-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="oc-label">O R D E R &nbsp; C O N F I R M E D</p>
          <h1 className="oc-title">Thank You!</h1>
          <p className="oc-sub">Your order has been placed successfully.</p>
          <p className="oc-order-id">Order ID: <strong>{order._id}</strong></p>
        </div>

        {/* Order Details Card */}
        <div className="oc-card">
          <div className="oc-card-section">
            <h3 className="oc-card-heading">Items Ordered</h3>
            <ul className="oc-items">
              {order.items.map((item, i) => (
                <li key={i} className="oc-item">
                  <div className="oc-item__img-wrap">
                    <img src={item.image || '/ring_product.png'} alt={item.name} className="oc-item__img" />
                  </div>
                  <div className="oc-item__info">
                    <p className="oc-item__name">{item.name}</p>
                    <p className="oc-item__qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="oc-item__price">{formatted(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="oc-divider"></div>

          <div className="oc-card-cols">
            <div className="oc-card-section">
              <h3 className="oc-card-heading">Shipping Address</h3>
              <p className="oc-address">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.phone}<br />
                {order.shippingAddress.addressLine}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
            </div>

            <div className="oc-card-section">
              <h3 className="oc-card-heading">Payment Summary</h3>
              <div className="oc-summary-row">
                <span>Subtotal</span>
                <span>{formatted(order.itemsTotal)}</span>
              </div>
              <div className="oc-summary-row">
                <span>Shipping</span>
                <span className="oc-free">Free</span>
              </div>
              <div className="oc-divider-sm"></div>
              <div className="oc-summary-row oc-summary-row--total">
                <span>Total</span>
                <span>{formatted(order.totalAmount)}</span>
              </div>
              <div className="oc-status-badges">
                <span className="oc-badge oc-badge--status">{order.orderStatus}</span>
                <span className="oc-badge oc-badge--payment">{order.paymentMethod.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="oc-actions">
          <Link to="/my-orders" className="btn-primary"><span>View My Orders</span></Link>
          <Link to="/collections" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
