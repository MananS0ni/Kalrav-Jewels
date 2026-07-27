import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, removeFromCart, updateQty, totalItems, totalPrice, cartOpen, setCartOpen } = useCart();
  const { user, setAuthOpen } = useAuth();
  const navigate = useNavigate();

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  const handleCheckout = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <p className="cart-drawer__label">Your Selection</p>
            <h2 className="cart-drawer__title">Shopping Bag</h2>
          </div>
          <button className="cart-drawer__close" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-drawer__divider"></div>

        {/* Items */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="cart-empty__icon">◇</p>
              <p className="cart-empty__title">Your bag is empty</p>
              <p className="cart-empty__sub">Discover our curated collections</p>
              <button className="btn-outline cart-empty__btn" onClick={() => setCartOpen(false)}>
                Explore Collections
              </button>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map((item, idx) => (
                <li key={`${item.productId}-${item.size || idx}`} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img src={item.image} alt={item.name} className="cart-item__img" />
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__category">{item.category}</p>
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__meta">
                      {[item.material, item.purity, item.size ? `Size: ${item.size}` : null].filter(Boolean).join(' · ')}
                    </p>
                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button onClick={() => updateQty(item.productId, item.qty - 1, item.size)} className="qty-btn" aria-label="Decrease">−</button>
                        <span className="qty-val">{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.qty + 1, item.size)} className="qty-btn" aria-label="Increase">+</button>
                      </div>
                      <p className="cart-item__price">{formatted(item.price)}</p>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.productId, item.size)} aria-label="Remove">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-total-row">
              <span className="cart-total__label">Estimated Total</span>
              <span className="cart-total__value">{formatted(totalPrice)}</span>
            </div>
            <p className="cart-total__note">Taxes & custom duties may apply</p>
            <button
              className="btn-primary cart-checkout-btn"
              id="cart-checkout-btn"
              onClick={handleCheckout}
            >
              <span>{user ? 'Proceed to Checkout' : 'Sign In to Checkout'}</span>
            </button>
            <button className="cart-continue" onClick={() => setCartOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
