import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const emptyForm = {
  name: '', description: '', price: '', category: 'rings',
  material: '', weight: '', purity: '', stock: 10,
  isFeatured: false, tags: '', images: '',
};

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentOptions = ['pending', 'awaitingVerification', 'paid', 'failed', 'refunded'];
const statusColors = {
  pending: '#b8960c', confirmed: '#5b8fb9', processing: '#c4842d',
  shipped: '#6dab6d', delivered: '#4a9a4a', cancelled: '#cf6f6f',
};
const paymentColors = {
  pending: '#b8960c', awaitingVerification: '#e07b2e', paid: '#4a9a4a', failed: '#cf6f6f', refunded: '#5b8fb9',
};

const Admin = () => {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Toggles for completed history
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);
  const [showCompletedEnquiries, setShowCompletedEnquiries] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchProducts = () => fetch(`${API}/products`).then(r => r.json()).then(setProducts);
  const fetchOrders = () => fetch(`${API}/orders`, { headers }).then(r => r.json()).then(setOrders);
  const fetchEnquiries = () => fetch(`${API}/contact`, { headers }).then(r => r.json()).then(setEnquiries);
  const fetchUserStats = () => fetch(`${API}/users/stats`, { headers }).then(r => r.json()).then(setUserStats).catch(console.error);

  useEffect(() => { fetchProducts(); fetchOrders(); fetchEnquiries(); fetchUserStats(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  // ── Enquiry handlers ──
  const updateEnquiryStatus = async (id, status) => {
    try {
      const res = await fetch(`${API}/contact/${id}/status`, { method: 'PUT', headers, body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error('Failed to update status');
      flash('✓ Enquiry updated');
      fetchEnquiries();
    } catch (err) {
      flash('✗ ' + err.message);
    }
  };

  // ── Product handlers ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      images: form.images.split(',').map(i => i.trim()).filter(Boolean),
    };
    try {
      const url = editId ? `${API}/products/${editId}` : `${API}/products`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash(editId ? '✓ Product updated!' : '✓ Product added!');
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      flash('✗ ' + err.message);
    }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, material: p.material, weight: p.weight,
      purity: p.purity, stock: p.stock, isFeatured: p.isFeatured,
      tags: p.tags.join(', '), images: p.images.join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers });
    flash('✓ Product deleted.');
    fetchProducts();
  };

  // ── Order handlers ──
  const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      flash('✓ Order updated!');
      fetchOrders();
    } catch (err) {
      flash('✗ ' + err.message);
    }
  };

  // ── Access Gate ──
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-gate">
        <h2 style={{ color: '#cf6f6f', fontWeight: 400, letterSpacing: '2px' }}>Access Denied</h2>
        <p style={{ marginTop: '10px' }}>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">KALRAV <span>Admin Panel</span></h1>
        <p className="admin-sub">Manage your jewellery collection</p>
      </div>

      {msg && <div className={`admin-flash ${msg.startsWith('✗') ? 'admin-flash--err' : ''}`}>{msg}</div>}

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'products' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`admin-tab ${tab === 'orders' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Orders ({orders.filter(o => !(o.orderStatus === 'delivered' && o.paymentStatus === 'paid')).length})
        </button>
        <button
          className={`admin-tab ${tab === 'enquiries' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('enquiries')}
        >
          Enquiries ({enquiries.filter(e => e.status !== 'resolved').length})
        </button>
        <button
          className={`admin-tab ${tab === 'users' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('users')}
        >
          Users
        </button>
      </div>

      {/* ═══════════════════ PRODUCTS TAB ═══════════════════ */}
      {tab === 'products' && (
        <>
          {/* Form */}
          <div className="admin-section">
            <h2 className="admin-section-title">{editId ? 'Edit Product' : 'Add New Product'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Diamond Solitaire Ring" />
                </div>
                <div className="admin-field">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="185000" />
                </div>
                <div className="admin-field">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="10" />
                </div>
                <div className="admin-field">
                  <label>Material</label>
                  <input name="material" value={form.material} onChange={handleChange} placeholder="18K Gold" />
                </div>
                <div className="admin-field">
                  <label>Weight</label>
                  <input name="weight" value={form.weight} onChange={handleChange} placeholder="3.2g" />
                </div>
                <div className="admin-field">
                  <label>Purity / Stone</label>
                  <input name="purity" value={form.purity} onChange={handleChange} placeholder="VS1 Diamond" />
                </div>
                <div className="admin-field">
                  <label>Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="bestseller, new" />
                </div>
                <div className="admin-field admin-field--full">
                  <label>Images (comma separated paths)</label>
                  <input name="images" value={form.images} onChange={handleChange} placeholder="/ring_product.png" />
                </div>
                <div className="admin-field admin-field--full">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="A breathtaking solitaire..." />
                </div>
                <div className="admin-field admin-field--check">
                  <label>
                    <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                    Featured on homepage
                  </label>
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
                  {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
                {editId && (
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setEditId(null); setForm(emptyForm); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products Table */}
          <div className="admin-section">
            <h2 className="admin-section-title">All Products ({products.length})</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td className="admin-cat">{p.category}</td>
                      <td>₹{p.price.toLocaleString('en-IN')}</td>
                      <td className={p.stock === 0 ? 'admin-out' : ''}>{p.stock}</td>
                      <td>{p.isFeatured ? '★' : '—'}</td>
                      <td>
                        <button className="admin-btn admin-btn--edit" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="admin-btn admin-btn--del" onClick={() => handleDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════ ORDERS TAB ═══════════════════ */}
      {tab === 'orders' && (
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="admin-section-title" style={{ margin: 0 }}>Active Orders</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#b8960c', fontSize: '0.9rem', fontWeight: 500 }}>
              <input type="checkbox" checked={showCompletedOrders} onChange={(e) => setShowCompletedOrders(e.target.checked)} style={{ accentColor: '#b8960c' }} />
              Show Completed History
            </label>
          </div>

          {orders.filter(o => showCompletedOrders || !(o.orderStatus === 'delivered' && o.paymentStatus === 'paid')).length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No active orders need your attention right now.</p>
          ) : (
            <div className="admin-orders-list">
              {orders.filter(o => showCompletedOrders || !(o.orderStatus === 'delivered' && o.paymentStatus === 'paid')).map(order => (
                <div key={order._id} className="admin-order-card">
                  {/* Order Header */}
                  <div className="admin-order-header">
                    <div>
                      <p className="admin-order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      <p className="admin-order-id">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="admin-order-total">{formatted(order.totalAmount)}</div>
                  </div>

                  {/* Customer Info */}
                  <div className="admin-order-customer">
                    <div className="admin-order-customer-info">
                      <span className="admin-order-cust-label">Customer</span>
                      <span className="admin-order-cust-name">
                        {order.user?.name || 'Unknown'} — {order.user?.email || ''}
                      </span>
                    </div>
                    <div className="admin-order-customer-info">
                      <span className="admin-order-cust-label">Ship to</span>
                      <span className="admin-order-cust-name">
                        {order.shippingAddress.fullName}, {order.shippingAddress.phone}
                        <br />
                        {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="admin-order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="admin-order-item">
                        <img src={item.image || '/ring_product.png'} alt={item.name} className="admin-order-item-img" />
                        <div className="admin-order-item-info">
                          <span className="admin-order-item-name">{item.name}</span>
                          <span className="admin-order-item-meta">Qty: {item.quantity} × {formatted(item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Controls */}
                  <div className="admin-order-controls">
                    <div className="admin-order-control">
                      <label>Order Status</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value, null)}
                        style={{ borderColor: statusColors[order.orderStatus] }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="admin-order-control">
                      <label>Payment</label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateOrderStatus(order._id, null, e.target.value)}
                        style={{ borderColor: paymentColors[order.paymentStatus] }}
                      >
                        {paymentOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="admin-order-badges">
                      <span className="admin-order-badge" style={{ background: `${statusColors[order.orderStatus]}18`, color: statusColors[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                      <span className="admin-order-badge" style={{ background: `${(paymentColors[order.paymentStatus] || '#888')}18`, color: paymentColors[order.paymentStatus] || '#888' }}>
                        {order.paymentStatus}
                      </span>
                      <span className="admin-order-badge" style={{ background: '#3a3a3a', color: '#aaa' }}>
                        {order.paymentMethod.toUpperCase()}
                      </span>
                      {/* UTR/UPI ID display for UPI orders */}
                      {order.paymentMethod === 'upi' && order.utrNumber && (
                        <span className="admin-order-badge" style={{ background: '#1a3a2a', color: '#6dab6d', fontFamily: 'monospace', letterSpacing: '1px' }}>
                          UPI Ref: {order.utrNumber}
                        </span>
                      )}
                      {order.paymentMethod === 'upi' && !order.utrNumber && (
                        <span className="admin-order-badge" style={{ background: '#3a1a1a', color: '#cf6f6f' }}>
                          UPI Ref: Not Provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* ═══════════════════ ENQUIRIES TAB ═══════════════════ */}
      {tab === 'enquiries' && (
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="admin-section-title" style={{ margin: 0 }}>Active Enquiries</h2>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#b8960c', fontSize: '0.9rem', fontWeight: 500 }}>
              <input type="checkbox" checked={showCompletedEnquiries} onChange={(e) => setShowCompletedEnquiries(e.target.checked)} style={{ accentColor: '#b8960c' }} />
              Show Resolved History
            </label>
          </div>
          
          {enquiries.filter(e => showCompletedEnquiries || e.status !== 'resolved').length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No active enquiries need your attention right now.</p>
          ) : (
            <div className="admin-orders-list">
              {enquiries.filter(e => showCompletedEnquiries || e.status !== 'resolved').map(enq => (
                <div key={enq._id} className="admin-order-card" style={{ borderLeft: `4px solid ${enq.status === 'new' ? '#b8960c' : enq.status === 'resolved' ? '#4a9a4a' : '#5b8fb9'}` }}>
                  <div className="admin-order-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                    <div>
                      <p className="admin-order-date">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                        {enq.type === 'product' ? 'Product Callback Request' : 'Contact Form Message'}
                      </p>
                    </div>
                    <div>
                      <select 
                        value={enq.status}
                        onChange={(e) => updateEnquiryStatus(enq._id, e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-order-customer" style={{ marginTop: '16px' }}>
                    <div className="admin-order-customer-info">
                      <span className="admin-order-cust-label">Customer Details</span>
                      <span className="admin-order-cust-name" style={{ marginTop: '4px' }}>
                        <strong>Name:</strong> {enq.name} <br/>
                        <strong>Phone:</strong> {enq.phone || 'N/A'} <br/>
                        {enq.type === 'contact' && <><strong>Email:</strong> {enq.email} <br/></>}
                      </span>
                    </div>
                    {enq.type === 'product' ? (
                      <div className="admin-order-customer-info">
                        <span className="admin-order-cust-label">Product of Interest</span>
                        <span className="admin-order-cust-name" style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '4px' }}>
                          {enq.productName}
                        </span>
                      </div>
                    ) : (
                      <div className="admin-order-customer-info">
                        <span className="admin-order-cust-label">Subject</span>
                        <span className="admin-order-cust-name" style={{ marginTop: '4px' }}>
                          {enq.subject}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {enq.type === 'contact' && enq.message && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '4px', borderLeft: '3px solid #ddd' }}>
                      <p style={{ color: '#666', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Message</p>
                      <p style={{ color: '#333', lineHeight: '1.6' }}>{enq.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ USERS TAB ═══════════════════ */}
      {tab === 'users' && (
        <div className="admin-section">
          <h2 className="admin-section-title">Registered Users</h2>
          
          {!userStats ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading user stats...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div className="admin-order-card" style={{ borderLeft: '4px solid #b8960c', padding: '24px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Registered Users</p>
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#333' }}>{userStats.totalUsers}</h3>
              </div>
              <div className="admin-order-card" style={{ borderLeft: '4px solid #5b8fb9', padding: '24px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>New Users (Last 7 Days)</p>
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#333' }}>{userStats.newUsersLast7Days}</h3>
              </div>
              <div className="admin-order-card" style={{ borderLeft: '4px solid #4a9a4a', padding: '24px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>New Users (Last 30 Days)</p>
                <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#333' }}>{userStats.newUsersLast30Days}</h3>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
