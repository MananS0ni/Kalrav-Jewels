import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import AuthModal from '../AuthModal/AuthModal';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navClass = `navbar ${scrolled || !isHome ? 'navbar--solid' : 'navbar--transparent'} ${menuOpen ? 'navbar--open' : ''}`;

  return (
    <>
      <header className={navClass} id="navbar">
        <div className="navbar__inner container">
          {/* Left Nav */}
          <nav className="navbar__links navbar__links--left" aria-label="Primary left navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/collections" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Collections</NavLink>
          </nav>

          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="Kalrav Jewel Home">
            <span className="logo-top">KALRAV</span>
            <span className="logo-divider"></span>
            <span className="logo-bottom">JEWEL</span>
          </Link>

          {/* Right Nav */}
          <nav className="navbar__links navbar__links--right" aria-label="Primary right navigation">
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Contact</NavLink>

            {/* User Icon */}
            <div className="navbar__icon-wrap">
              {user ? (
                <div className="navbar__user-menu-wrap">
                  <button
                    className="navbar__icon-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Account menu"
                    id="user-menu-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="navbar__user-dropdown" id="user-dropdown">
                      <p className="user-dropdown__name">{user.name}</p>
                      <p className="user-dropdown__email">{user.email}</p>
                      <div className="user-dropdown__divider"></div>
                      <Link to="/my-orders" className="user-dropdown__link" onClick={() => setUserMenuOpen(false)}>
                        My Orders
                      </Link>
                      <div className="user-dropdown__divider"></div>
                      <button className="user-dropdown__logout" onClick={() => { logout(); setUserMenuOpen(false); }} id="logout-btn">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="navbar__icon-btn" onClick={() => setAuthOpen(true)} aria-label="Sign in" id="signin-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <button
              className="navbar__icon-btn navbar__cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              id="cart-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="cart-badge" id="cart-badge">{totalItems}</span>
              )}
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <div className="navbar__mobile-right">
            <button className="navbar__icon-btn navbar__cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              id="hamburger-btn"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`} id="mobile-menu">
          <nav aria-label="Mobile navigation">
            <NavLink to="/" className="mobile-link">Home</NavLink>
            <NavLink to="/collections" className="mobile-link">Collections</NavLink>
            <NavLink to="/contact" className="mobile-link">Contact</NavLink>
            {user ? (
              <button className="mobile-link mobile-link--btn" onClick={() => logout()}>Sign Out ({user.name.split(' ')[0]})</button>
            ) : (
              <button className="mobile-link mobile-link--btn" onClick={() => { setAuthOpen(true); setMenuOpen(false); }}>Sign In</button>
            )}
          </nav>
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
};

export default Navbar;
