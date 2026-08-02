import './Testimonials.css';

const reviews = [
  {
    name: 'Priyanka Sharma',
    city: 'Mumbai',
    rating: 5,
    title: 'Exquisite Craftsmanship',
    text: 'Bought the Silver Tennis Bracelet for my anniversary. The shine of the 925 sterling silver and zircons is breathtaking. Arrived beautifully packaged!',
    product: 'Silver Tennis Bracelet',
  },
  {
    name: 'Ananya Mehta',
    city: 'Ahmedabad',
    rating: 5,
    title: 'Authentic 925 Hallmarked',
    text: ' Kalrav Jewels is our family tradition. The quality of their silver necklaces and hallmarked purity gives complete peace of mind. Highly recommended!',
    product: 'Silver Pearl Drop Necklace',
  },
  {
    name: 'Rohan Verma',
    city: 'Delhi',
    rating: 5,
    title: 'Fast Shipping & Premium Box',
    text: 'Ordered silver starburst earrings for my wife. The order arrived in 2 days in a gorgeous gift box with purity certification. Super impressed!',
    product: 'Starburst Stud Earrings',
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Patron Experiences</p>
          <div className="gold-line"></div>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle" style={{ maxWidth: '480px', margin: '12px auto 0' }}>
            Cherished reviews from families who trust Kalrav Jewels for their special moments.
          </p>
        </div>

        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-card__stars">
                {'★'.repeat(rev.rating)}
              </div>
              <h4 className="testimonial-card__title">"{rev.title}"</h4>
              <p className="testimonial-card__text">{rev.text}</p>
              <div className="testimonial-card__footer">
                <div className="testimonial-card__author">
                  <span className="author-name">{rev.name}</span>
                  <span className="author-city">{rev.city}</span>
                </div>
                <span className="verified-badge">✓ Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
