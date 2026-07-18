import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './MyOrders.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const statusColors = {
  pending: '#b8960c',
  confirmed: '#5b8fb9',
  processing: '#c4842d',
  shipped: '#6dab6d',
  delivered: '#4a9a4a',
  cancelled: '#cf6f6f',
};

const MyOrders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (!user) {
    return (
      <div className="mo-gate">
        <h2>Please sign in to view orders</h2>
        <Link to="/" className="btn-primary"><span>Go Home</span></Link>
      </div>
    );
  }

  return (
    <div className="mo-page">
      <div className="container">
        <div className="mo-header">
          <p className="mo-label">Y O U R &nbsp; A C C O U N T</p>
          <h1 className="mo-title">My Orders</h1>
          <div className="gold-line"></div>
        </div>

        {loading ? (
          <div className="mo-loading">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="mo-empty">
            <p className="mo-empty__icon">◇</p>
            <h2 className="mo-empty__title">No orders yet</h2>
            <p className="mo-empty__sub">Your order history will appear here</p>
            <Link to="/collections" className="btn-primary"><span>Start Shopping</span></Link>
          </div>
        ) : (
          <div className="mo-list">
            {orders.map((order) => (
              <div key={order._id} className="mo-card">
                <div className="mo-card__header">
                  <div>
                    <p className="mo-card__date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                    <p className="mo-card__id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="mo-card__right">
                    <span
                      className="mo-status-badge"
                      style={{ background: `${statusColors[order.orderStatus]}18`, color: statusColors[order.orderStatus] }}
                    >
                      {order.orderStatus}
                    </span>
                    <p className="mo-card__total">{formatted(order.totalAmount)}</p>
                  </div>
                </div>

                <div className="mo-card__divider"></div>

                <div className="mo-card__items">
                  {order.items.map((item, i) => (
                    <div key={i} className="mo-card__item">
                      <div className="mo-card__item-img-wrap">
                        <img src={item.image || '/ring_product.webp'} alt={item.name} className="mo-card__item-img" />
                      </div>
                      <div className="mo-card__item-info">
                        <p className="mo-card__item-name">{item.name}</p>
                        <p className="mo-card__item-meta">Qty: {item.quantity} · {formatted(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mo-card__footer">
                  <div className="mo-card__address">
                    <span className="mo-card__addr-label">Delivering to:</span>
                    {order.shippingAddress.fullName}, {order.shippingAddress.city}
                  </div>
                  <Link to={`/order-confirmation/${order._id}`} className="mo-card__details-link">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
