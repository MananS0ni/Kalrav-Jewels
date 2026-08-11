import { useState, useRef, useEffect } from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const craftStages = [
  {
    id: 'melting',
    stage: '01',
    title: 'Melting & Refining',
    pastTitle: 'Clay Crucibles & Open Flames',
    pastDesc: 'In 1952, gold and silver were melted in hand-held clay crucibles over roaring ember flames. Artisans judged purity by color and temperature by sight.',
    modernTitle: 'Precision Induction Furnaces',
    modernDesc: 'Today, temperature-controlled electromagnetic furnaces ensure zero impurity loss, exact 925 sterling silver hallmarked purity, and zero emissions.'
  },
  {
    id: 'shaping',
    stage: '02',
    title: 'Beating & Shaping',
    pastTitle: 'Hammer & Heavy Anvil',
    pastDesc: 'Raw metal ingots were beaten into thin sheets and wires by hand, striking heavy steel hammers thousands of times with unyielding patience.',
    modernTitle: '3D CAD & Laser Forming',
    modernDesc: 'Digital 3D CAD modeling enables micron-level precision geometry before laser-cut shaping, producing seamless curves and flawless symmetry.'
  },
  {
    id: 'setting',
    stage: '03',
    title: 'Gem & Stone Setting',
    pastTitle: 'Hand Chisels & Optic Loupes',
    pastDesc: 'Master craftsmen sat for hours under magnifying glasses, hand-carving delicate prongs and setting gemstones using manual push chisels.',
    modernTitle: 'Micro-Laser Setting',
    modernDesc: 'High-powered microscopic lasers lock stones into place with mathematical stability, creating durable pieces designed for daily wear.'
  },
  {
    id: 'storefront',
    stage: '04',
    title: 'The Storefront',
    pastTitle: 'The Local Atelier (1952)',
    pastDesc: 'A humble wooden counter serving local families across generations, built entirely on word-of-mouth trust, cup of chai, and personal bonds.',
    modernTitle: 'Global Digital Platform (2026)',
    modernDesc: 'Kalrav Jewels online brings the family legacy directly to your doorstep worldwide, offering 100% hallmarked silver with modern ecommerce ease.'
  }
];

const milestones = [
  { year: 'Generation 1', title: 'The Genesis', desc: 'Our family heritage began with traditional goldsmithing and handcrafted metalworking, laying down the sacred values of purity and trust.' },
  { year: 'Generation 2', title: 'Atelier Expansion', desc: 'Expanding our artistry across precious gold and silver jewelry, catering to families and building lifelong bonds.' },
  { year: 'Generation 3', title: 'Mastery & Technique', desc: 'Refining intricate hand filigree, stone setting, and traditional hand-hammering techniques passed down through decades.' },
  { year: 'Generation 4', title: 'Retail Excellence', desc: 'Solidifying our physical presence with trusted storefront craftsmanship and dedicated family service across generations.' },
  { year: 'Generation 5 (2026)', title: 'The Digital Horizon — Kalrav Jewels', desc: 'Taking 5 generations of family legacy digital with Kalrav Jewels online, specializing exclusively in hallmarked 925 sterling silver for the modern world.' }
];

const values = [
  { title: 'Certified Purity', desc: 'Every 925 sterling silver piece is hallmarked for lifetime authenticity and trust.' },
  { title: 'Artisanal Heritage', desc: 'Each design honours 5 generations of handmade metalworking tradition passed from ancestors to present day.' },
  { title: 'Modern Precision', desc: 'Combining old-world forging with laser technology to build jewelry engineered for daily wear.' },
  { title: 'Unbroken Trust', desc: 'Five generations of family integrity, transparent pricing, and direct-to-customer care.' }
];

const About = () => {
  // Slider state (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const sliderRef = useRef(null);

  const handleMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <div className="about-page">
      <SEO
        title="Our Heritage & Story | 1952 to Today"
        description="Explore 70+ years of Kalrav Jewels heritage. From 1952 handcrafted gold & silver hammering in crucibles to modern 925 sterling silver digital precision."
      />
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__overlay"></div>
        <div className="container page-header__content">
          <p className="section-label" style={{ color: 'var(--gold-light)' }}>70+ Years of Craftsmanship</p>
          <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
          <h1 className="page-header__title">Our Story & Heritage</h1>
          <p className="page-header__subtitle">
            From hand-beating raw silver on an anvil in 1952 to 3D laser precision in 2026.
          </p>
        </div>
      </div>

      {/* Legacy Quote Banner (Stitch Design) */}
      <section className="legacy-quote-section">
        <div className="container text-center">
          <div className="quote-mark">99</div>
          <blockquote className="legacy-quote-text">
            "Jewelry is more than an accessory;<br />it is a legacy you wear."
          </blockquote>
          <p className="legacy-quote-author">— THE KALRAV ARTISANS</p>
        </div>
      </section>

      {/* Interactive "Then vs Now" Time-Slider */}
      <section className="era-slider-section" id="era-slider-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '40px' }}>
            <p className="section-label">Interactive Experience</p>
            <div className="gold-line-center" style={{ marginTop: '12px' }}></div>
            <h2 className="section-title">The Evolution of the Craft</h2>
            <p className="section-subtitle" style={{ maxWidth: '640px', margin: '14px auto 0' }}>
              Drag the slider below to scrub through time — see how our traditional 1952 hand forging morphed into modern 2026 precision technology.
            </p>
          </div>

          <div
            className="era-slider-container"
            ref={sliderRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
            onTouchMove={handleTouchMove}
          >
            {/* 1952 Heritage Side (Underneath / Background) */}
            <div className="era-panel era-panel--past">
              <div className="era-content">
                <span className="era-year-badge era-year-badge--past">1952 • THE HANDCRAFT ERA</span>
                <h3 className="era-heading">Flame, Crucible & Anvil</h3>
                <p className="era-body">
                  Raw gold & silver melted in clay crucibles over glowing embers. Every ingot was hammered by hand, shaped with patience, and polished with artisan pride in a small local atelier.
                </p>
                <div className="era-tags">
                  <span>🔥 Open Flame Crucible</span>
                  <span>🔨 Heavy Hammer & Anvil</span>
                  <span>👁️ Hand-Eye Purity Mastery</span>
                </div>
              </div>
            </div>

            {/* 2026 Modern Side (Clipped Overlay) */}
            <div
              className="era-panel era-panel--modern"
              style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
            >
              <div className="era-content">
                <span className="era-year-badge era-year-badge--modern">2026 • THE MODERN HORIZON</span>
                <h3 className="era-heading">3D CAD & Laser Precision</h3>
                <p className="era-body">
                  Modern induction furnaces, micron-level 3D CAD modeling, and micro-laser setting — creating flawless 925 sterling silver delivered to customers globally via our digital storefront.
                </p>
                <div className="era-tags">
                  <span>⚡ 3D CAD & Laser Cutting</span>
                  <span>✨ 925 Sterling Hallmarked</span>
                  <span>🌐 Global Online Storefront</span>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="era-slider-divider"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="era-slider-handle" title="Drag to compare 1952 vs 2026">
                <span className="handle-arrow">◄</span>
                <span className="handle-text">1952 | 2026</span>
                <span className="handle-arrow">►</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Evolution Grid */}
      <section className="craft-evolution-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <p className="section-label">Inside The Atelier</p>
            <div className="gold-line-center" style={{ marginTop: '12px' }}></div>
            <h2 className="section-title">The Four Pillars of Evolution</h2>
            <p className="section-subtitle" style={{ maxWidth: '600px', margin: '14px auto 0' }}>
              Explore how each fundamental stage of making Kalrav Jewels evolved across 70+ years of family dedication.
            </p>
          </div>

          {/* Stage Tabs */}
          <div className="craft-stage-tabs">
            {craftStages.map((st, idx) => (
              <button
                key={st.id}
                className={`craft-tab-btn ${activeStage === idx ? 'active' : ''}`}
                onClick={() => setActiveStage(idx)}
              >
                <span className="craft-tab-num">{st.stage}</span>
                <span className="craft-tab-title">{st.title}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Display Card */}
          <div className="craft-stage-card">
            <div className="craft-card-side craft-card-side--past">
              <div className="craft-badge">1952 Traditional Method</div>
              <h3>{craftStages[activeStage].pastTitle}</h3>
              <p>{craftStages[activeStage].pastDesc}</p>
            </div>
            <div className="craft-card-divider">
              <div className="divider-icon">➔</div>
            </div>
            <div className="craft-card-side craft-card-side--modern">
              <div className="craft-badge craft-badge--gold">2026 Modern Innovation</div>
              <h3>{craftStages[activeStage].modernTitle}</h3>
              <p>{craftStages[activeStage].modernDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Text */}
      <section className="founder-section" id="founder-section">
        <div className="container founder-section__inner">
          <div className="founder-content">
            <p className="section-label">Our Family Story</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">A Legacy Forged in Flame & Integrity</h2>
            <p className="section-subtitle" style={{ marginTop: '20px' }}>
              Our family journey started in 1952 when my grandfather set up a small atelier with a single workbench. Armed with clay crucibles, hand hammers, and a passion for metalworking, he established a sacred trust with local families that endured for decades.
            </p>
            <p className="section-subtitle" style={{ marginTop: '14px' }}>
              Our craft has evolved across generations of dedicated family artisans. Today, as the <strong>5th generation</strong>, I established <strong>Kalrav Jewels online</strong> to take 5 generations of family heritage forward into the digital age — specializing exclusively in premium, hallmarked 925 sterling silver with the same uncompromised dedication our ancestors established in 1952.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section" id="timeline-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '70px' }}>
            <p className="section-label">70+ Years of History</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">Our Timeline Journey</h2>
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
            <div className="timeline-line timeline-line--glowing"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section" id="values-section">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '60px' }}>
            <p className="section-label">Our Pillars</p>
            <div className="gold-line-center" style={{ marginTop: '14px' }}></div>
            <h2 className="section-title">Why Kalrav Jewels</h2>
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

      {/* CTA Section */}
      <section className="about-cta" id="about-cta-section">
        <div className="container about-cta__inner">
          <div>
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Explore The Craft</p>
            <div className="gold-line-center" style={{ margin: '14px auto' }}></div>
            <h2 className="about-cta__title">Experience 70+ Years of Artistry</h2>
            <p className="about-cta__subtitle">
              Discover our exclusive 925 sterling silver collections or contact our team for custom inquiries.
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
