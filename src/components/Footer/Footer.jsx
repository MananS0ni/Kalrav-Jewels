import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer-logo-top">KALRAV</span>
              <span className="footer-logo-line"></span>
              <span className="footer-logo-bottom">JEWEL</span>
            </div>
            <p className="footer__tagline">
              Crafting timeless 925 sterling silver jewellery.<br />
              Where every piece tells a story.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://wa.me/919537068100" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer__col">
            <h4 className="footer__col-title">Explore</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div className="footer__col">
            <h4 className="footer__col-title">Collections</h4>
            <ul className="footer__list">
              <li><Link to="/collections?category=rings">Rings</Link></li>
              <li><Link to="/collections?category=necklaces">Necklaces</Link></li>
              <li><Link to="/collections?category=earrings">Earrings</Link></li>
              <li><Link to="/collections?category=bracelets">Bracelets</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact-list">
              <li>
                <span className="contact-label">Phone</span>
                <a href="tel:+919537068100" className="contact-val">+91 95370 68100</a>
              </li>
              <li>
                <span className="contact-label">Email</span>
                <a href="mailto:info@nhsonijewellers.com" className="contact-val">info@nhsonijewellers.com</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Kalrav Jewel. All Rights Reserved.
          </p>
          <p className="footer__crafted">
            Crafted with dedication in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
