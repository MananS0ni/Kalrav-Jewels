import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const API = 'http://localhost:5000/api';

const emptyForm = {
  name: '', description: '', price: '', category: 'rings',
  material: '', weight: '', purity: '', stock: 10,
  isFeatured: false, tags: '', images: '',
};

const Admin = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchProducts = () =>
    fetch(`${API}/products`).then(r => r.json()).then(setProducts);

  useEffect(() => { fetchProducts(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

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
    </div>
  );
};

export default Admin;
