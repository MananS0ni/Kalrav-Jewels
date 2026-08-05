import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import SEO from '../../components/SEO/SEO';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatted = (n) => '₹' + n.toLocaleString('en-IN');

  return (
    <div className="wishlist-page">
      <SEO title="My Saved Wishlist" description="Your saved 925 sterling silver jewellery collection at Kalrav Jewels." />
      <div className="container">
        <div className="wishlist-header">
          <p className="wishlist-label">Y O U R &nbsp; S A V E D &nbsp; P I E C E S</p>
          <h1 className="wishlist-title">My Wishlist</h1>
          <div className="gold-line"></div>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <p className="wishlist-empty__icon">♡</p>
            <h2 className="wishlist-empty__title">Your Wishlist is empty</h2>
            <p className="wishlist-empty__sub">Save your favorite handcrafted silver pieces here for later.</p>
            <Link to="/collections" className="btn-primary">
              <span>Explore Collections</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-actions-bar">
              <span className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved</span>
              <button className="wishlist-clear-btn" onClick={clearWishlist}>
                Clear All
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((item) => {
                const id = item._id || item.id;
                const image = item.images?.[0] || item.image || '/ring_product.webp';

                return (
                  <div key={id} className="wishlist-card">
                    <div className="wishlist-card__image-wrap">
                      <img src={image} alt={item.name} className="wishlist-card__image" />
                      <button
                        className="wishlist-remove-btn"
                        onClick={() => removeFromWishlist(id)}
                        aria-label="Remove from wishlist"
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="wishlist-card__info">
                      <p className="wishlist-card__category">{item.category}</p>
                      <Link to={`/collections/${id}`} className="wishlist-card__name-link">
                        <h3 className="wishlist-card__name">{item.name}</h3>
                      </Link>
                      <p className="wishlist-card__price">{formatted(item.price)}</p>

                      <button
                        className="btn-primary wishlist-add-cart-btn"
                        onClick={() => {
                          addToCart(item);
                        }}
                      >
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
