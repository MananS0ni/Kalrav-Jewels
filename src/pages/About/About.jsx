import './About.css';
import { Link } from 'react-router-dom';

const milestones = [
  { year: '1952', title: 'Founded', desc: 'Shri Narendra H. Soni establishes the first shop with a vision for exquisite handcrafted silver jewellery.' },
  { year: '1975', title: 'Legacy Grows', desc: 'Second generation joins the family craft, introducing new design sensibilities and silver techniques.' },
  { year: '1998', title: 'Modern Atelier', desc: 'Kalrav Jewel expands into a full-fledged atelier with in-house craftsmen specialising in 925 sterling silver.' },
  { year: '2008', title: '925 Certification', desc: 'Among the first in the region to achieve hallmarking certification for all 925 sterling silver pieces.' },
  { year: '2020', title: 'Digital Presence', desc: 'Bringing the showroom experience to the world through our digital storefront.' },
  { year: 'Today', title: 'Timeless Craft', desc: 'Continuing to serve families across generations with integrity, artistry, and sterling silver.' },
];

const values = [
  { title: 'Integrity', desc: 'Transparent pricing, certified purity, and honest craftsmanship — always.' },
  { title: 'Craftsmanship', desc: 'Every piece is handcrafted by skilled artisans who treat jewellery as art.' },
  { title: 'Heritage', desc: 'Rooted in Indian tradition while embracing contemporary design evolution.' },
  { title: 'Trust', desc: 'Seven decades of trusted relationships with families across generations.' },
];

const About = () => {
  return (
    <div className="about-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>Kalrav Jewel</p>
          <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
          <h1 className="page-header__title">Our Story</h1>
          <p className="page-header__subtitle">
            Seven decades of devotion, craftsmanship, and trust.
          </p>
        </div>
      </div>

      {/* Founder Story */}
      <section className="founder-section" id="founder-section">
        <div className="container founder-section__inner">
          <div className="founder-image-wrap">
            <img src="/store_interior.png" alt="Kalrav Jewel heritage" className="founder-img" />
            <div className="founder-badge">
              <span className="founder-badge-top">Est.</span>
              <span className="founder-badge-year">1952</span>
            </div>
          </div>
          <div className="founder-content">
            <p className="section-label">The Founding Vision</p>
            <div className="gold-line" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">A Dream Forged<br />in Sterling Silver</h2>
            <p className="section-subtitle" style={{ marginTop: '20px' }}>
              In 1952, Shri Narendra H. Soni set up a modest shop with a singular vision: 
              to create 925 sterling silver jewellery that would be passed down through generations. Armed with 
              traditional craftsmanship learned from master silversmiths and an unwavering 
              commitment to purity, he built more than a business — he built a legacy.
            </p>
            <p className="section-subtitle" style={{ marginTop: '14px' }}>
              Today, Kalrav Jewel stands as a symbol of trust for thousands of families 
              across India. Our craft has evolved, but our values remain exactly as our 
              founder intended — rooted in honesty, artistry, and the celebration of life's 
              most precious moments.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section" id="values-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-label">What We Stand For</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card" id={`value-${i}`}>
                <div className="value-number">0{i + 1}</div>
                <h3 className="value-title">{v.title}</h3>
                <div className="gold-line" style={{ margin: '16px 0' }}></div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section" id="timeline-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '70px' }}>
            <p className="section-label">Our Journey</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">Seven Decades of Legacy</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`} id={`milestone-${i}`}>
                <div className="timeline-content">
                  <span className="timeline-year">{m.year}</span>
                  <h3 className="timeline-title">{m.title}</h3>
                  <p className="timeline-desc">{m.desc}</p>
                </div>
                <div className="timeline-dot"></div>
              </div>
            ))}
            <div className="timeline-line"></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta" id="about-cta-section">
        <div className="container about-cta__inner">
          <div>
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Begin Your Journey</p>
            <div className="gold-line-center" style={{ margin: '14px auto' }}></div>
            <h2 className="about-cta__title">Experience the Legacy</h2>
            <p className="about-cta__subtitle">
              Browse our collections online or get in touch. Let us help you find the perfect piece for your story.
            </p>
          </div>
          <div className="about-cta__btns">
            <Link to="/collections" className="btn-primary" id="about-collections-btn"><span>View Collections</span></Link>
            <Link to="/contact" className="btn-outline-white" id="about-contact-btn">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
