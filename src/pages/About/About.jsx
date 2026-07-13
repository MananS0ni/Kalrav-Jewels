import './About.css';
import { Link } from 'react-router-dom';

const milestones = [
  { year: 'Generation 1', title: 'The Foundation', desc: 'My grandfather established our family\'s first jewellery shop with a vision for exquisite handcrafted pieces.' },
  { year: 'Generation 2', title: 'The Legacy Grows', desc: 'My father took over the physical store, expanding our fine gold and silver offerings and cementing our reputation for trust and purity.' },
  { year: 'Generation 3', title: 'The Digital Era', desc: 'I am taking our family business online with Kalrav Jewels, dedicating this new digital storefront exclusively to premium 925 sterling silver.' },
  { year: 'Today', title: 'Timeless Craft', desc: 'Continuing to serve families across generations with integrity, artistry, and 925 sterling silver.' },
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
            Three generations of devotion, craftsmanship, and trust.
          </p>
        </div>
      </div>

      {/* Founder Story */}
      <section className="founder-section" id="founder-section">
        <div className="container founder-section__inner">
          <div className="founder-content">
            <p className="section-label">Our Family Legacy</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">A Tradition Forged<br />in Precious Metals</h2>
            <p className="section-subtitle" style={{ marginTop: '20px' }}>
              Our story begins with my grandfather, who set up a modest shop with a singular vision: 
              to create fine gold and silver jewellery that would be passed down through generations. Armed with 
              traditional craftsmanship and an unwavering commitment to purity, he built more than a business — he built a legacy.
            </p>
            <p className="section-subtitle" style={{ marginTop: '14px' }}>
              That legacy was passed down to my father, who continues to run our family's physical store today, crafting in both gold and silver and maintaining the trust of countless families. Now, as the third generation, I am bringing our heritage into the digital age with Kalrav Jewels online — focusing exclusively on premium 925 sterling silver. Our craft is evolving, but our values remain exactly as my grandfather intended — rooted in honesty, artistry, and the celebration of life's most precious moments.
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
