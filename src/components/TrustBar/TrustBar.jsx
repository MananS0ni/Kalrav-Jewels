import './TrustBar.css';

const trustFeatures = [
  {
    icon: '💎',
    title: 'Certified 925 Silver',
    subtitle: 'BIS Hallmarked Purity Guarantee',
  },
  {
    icon: '🚚',
    title: 'Free Express Shipping',
    subtitle: 'Pan-India Insured Delivery',
  },
  {
    icon: '🔒',
    title: '100% Secure Checkout',
    subtitle: 'Instant UPI, Cards & COD',
  },
  {
    icon: '🔄',
    title: '7-Day Easy Exchange',
    subtitle: 'Hassle-Free Exchange Policy',
  },
];

const TrustBar = () => {
  return (
    <section className="trust-bar" id="trust-bar">
      <div className="container trust-bar__grid">
        {trustFeatures.map((item, idx) => (
          <div key={idx} className="trust-card">
            <span className="trust-card__icon">{item.icon}</span>
            <div className="trust-card__content">
              <h4 className="trust-card__title">{item.title}</h4>
              <p className="trust-card__sub">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
