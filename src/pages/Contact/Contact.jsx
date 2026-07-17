import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required.';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.subject.trim()) e.subject = 'Please select a subject.';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>We Would Love to Hear From You</p>
          <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
          <h1 className="page-header__title">Contact Us</h1>
          <p className="page-header__subtitle">
            Call us, email us, or simply leave a message below.
          </p>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="contact-main container" id="contact-main">
        {/* Left: Info */}
        <div className="contact-info">
          <p className="section-label">Reach Us</p>
          <div className="gold-line" style={{ marginTop: '14px' }}></div>
          <h2 className="contact-info__title">Get in Touch</h2>

          <div className="contact-info__list">
            <div className="contact-info-item" id="contact-phone">
              <span className="info-label">Phone</span>
              <a href="tel:+919537068100" className="info-val info-link">+91 95370 68100</a>
            </div>
            <div className="contact-info-item" id="contact-email">
              <span className="info-label">Email</span>
              <a href="mailto:info@kalravjewels.com" className="info-val info-link">info@kalravjewels.com</a>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="contact-form-wrap" id="contact-form-section">
          <p className="section-label">Send a Message</p>
          <div className="gold-line" style={{ marginTop: '14px' }}></div>
          <h2 className="contact-form__title">Get in Touch</h2>

          {submitted ? (
            <div className="form-success" id="form-success">
              <div className="form-success__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="form-success__title">Message Received</h3>
              <p className="form-success__desc">
                Thank you, <strong>{form.name}</strong>. Our team will get back to you within 24 hours.
              </p>
              <button className="btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} id="send-another-btn">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate id="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-subject" className="form-label">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={`form-input form-select ${errors.subject ? 'form-input--error' : ''}`}
                >
                  <option value="">Select a subject</option>
                  <option value="product-enquiry">Product Enquiry</option>
                  <option value="custom-design">Custom Design Request</option>
                  <option value="repair">Repair & Maintenance</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <span className="form-error">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="5"
                  className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn-primary" id="contact-submit-btn" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
