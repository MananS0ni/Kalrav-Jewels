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
    pastDesc: 'Over hand-held clay crucibles and ember flames, our founding patriarch judged gold and silver purity by color and temperature by sight.',
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
    pastTitle: 'The Local Atelier',
    pastDesc: 'A humble wooden counter serving local families across generations, built entirely on word-of-mouth trust, cup of chai, and personal bonds.',
    modernTitle: 'Global Digital Platform',
    modernDesc: 'Kalrav Jewels online brings four generations of family legacy directly to your doorstep worldwide, offering 100% hallmarked silver with modern ecommerce ease.'
  }
];

const milestones = [
  { year: 'Generation 1', title: 'The Genesis — Founding Patriarch', desc: 'Our family heritage began with our founding patriarch at a single hand-hammering workbench, establishing our sacred commitment to purity and trust.' },
  { year: 'Generation 2', title: 'Atelier Expansion', desc: 'Expanding our family artistry across precious gold and silver jewellery, building lifelong bonds with generations of families.' },
  { year: 'Generation 3', title: 'Mastery & Technique', desc: 'Refining intricate filigree, hand-setting gemstones, and traditional metalworking techniques passed down from our patriarch.' },
  { year: 'Generation 4', title: 'The Digital Horizon — Kalrav Jewels', desc: 'Continuing four generations of family legacy with Kalrav Jewels online, specializing exclusively in hallmarked 925 sterling silver for the modern world.' }
];

const values = [
  { title: 'Certified Purity', desc: 'Every 925 sterling silver piece is hallmarked for lifetime authenticity and trust.' },
  { title: 'Artisanal Heritage', desc: 'Each design honours four generations of handmade metalworking tradition passed from our patriarch to present day.' },
  { title: 'Modern Precision', desc: 'Combining old-world forging with laser technology to build jewellery engineered for daily wear.' },
  { title: 'Unbroken Trust', desc: 'Four generations of family integrity, transparent pricing, and direct-to-customer care.' }
];

const About = () => {
  // Slider state (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [beginningVisible, setBeginningVisible] = useState(false);
  const sliderRef = useRef(null);
  const beginningRef = useRef(null);

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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBeginningVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (beginningRef.current) {
      observer.observe(beginningRef.current);
    }

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about-page">
      <SEO
        title="Four Generations of Craftsmanship | Kalrav Jewels Heritage"
        description="Discover four generations of Kalrav Jewels heritage. From the hands of our founding patriarch to digital precision in hallmarked 925 sterling silver."
      />

      {/* Part 1: Redesigned Hero Section */}
      <header className="heritage-hero">
        <div className="heritage-hero__bg-shimmer"></div>
        <div className="heritage-hero__texture"></div>

        {/* Gold Thin Line SVG Animation */}
        <svg className="heritage-hero__line-svg" viewBox="0 0 1200 4" fill="none" preserveAspectRatio="none">
          <path d="M0 2 H1200" stroke="url(#heroGoldGrad)" strokeWidth="1.5" className="hero-animated-path" />
          <defs>
            <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#171717" />
              <stop offset="25%" stopColor="#C9A646" />
              <stop offset="50%" stopColor="#D8C58A" />
              <stop offset="75%" stopColor="#C9A646" />
              <stop offset="100%" stopColor="#171717" />
            </linearGradient>
          </defs>
        </svg>

        <div className="container heritage-hero__content">
          <span className="heritage-hero__eyebrow">FOUR GENERATIONS OF CRAFTSMANSHIP</span>

          <h1 className="heritage-hero__title">
            Four Generations.<br className="hero-br-desktop" /> One Legacy.
          </h1>

          <div className="heritage-hero__gold-divider">
            <span className="gold-divider-diamond">◆</span>
          </div>

          <p className="heritage-hero__subtitle">
            From the hands of our founding patriarch to the craftsmen of today, Kalrav Jewels continues a tradition built on trust, precision and timeless craftsmanship.
          </p>

          {/* Craftsmanship Detail Motif */}
          <div className="heritage-hero__emblem">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#D8C58A" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="32" cy="32" r="22" stroke="#C9A646" strokeWidth="1" opacity="0.8" />
              <path d="M32 14 V50 M14 32 H50" stroke="#D8C58A" strokeWidth="0.75" opacity="0.5" />
              <polygon points="32,20 35,28 32,36 29,28" fill="#C9A646" opacity="0.9" />
              <polygon points="32,28 40,32 32,36 24,32" fill="#D8C58A" opacity="0.7" />
            </svg>
            <span className="emblem-caption">ARTISANAL HERITAGE • 925 HALLMARKED</span>
          </div>
        </div>
      </header>

      {/* Part 1: Section 2 — "The Beginning" */}
      <section className="beginning-section" id="the-beginning" ref={beginningRef}>
        <div className="container beginning-section__inner">
          <div className={`beginning-text-col ${beginningVisible ? 'visible' : ''}`}>
            <div className="beginning-eyebrow-wrap">
              <span className="beginning-eyebrow">ARCHIVAL ORIGINS • EST. GENERATION 1</span>
            </div>
            <h2 className="beginning-title">Where It All Began</h2>
            <p className="beginning-lead">
              Forged at the workbench of our founding patriarch.
            </p>

            <div className="beginning-divider"></div>

            <p className="beginning-body">
              Our story opens in the quiet atelier of our founding patriarch. Long before mass manufacturing or automated assembly, every creation was born at a single wooden workbench, illuminated by the ember glow of open-flame crucibles and guided by absolute devotion to raw metal purity.
            </p>

            <p className="beginning-body">
              He believed that fine jewellery is never merely an object — it is a sacred bond between the master craftsman and the family who treasures it across generations. Armed with hand hammers, magnifying loupes, and unyielding integrity, he established a standard of 925 sterling hallmarked purity that remains the soul of Kalrav Jewels today.
            </p>

            <div className="beginning-highlights">
              <div className="highlight-item">
                <span className="highlight-label">PATRIARCH WORKBENCH</span>
                <span className="highlight-val">Original Atelier</span>
              </div>
              <div className="highlight-sep"></div>
              <div className="highlight-item">
                <span className="highlight-label">HAND-FORGED METALS</span>
                <span className="highlight-val">Pure Gold & 925 Silver</span>
              </div>
              <div className="highlight-sep"></div>
              <div className="highlight-item">
                <span className="highlight-label">UNBROKEN INTEGRITY</span>
                <span className="highlight-val">Four Generations</span>
              </div>
            </div>
          </div>

          {/* Archival Craftsmanship Illustration / Vector Workbench Sketch */}
          <div className={`beginning-visual-col ${beginningVisible ? 'visible' : ''}`}>
            <div className="archival-card">
              <div className="archival-card__border"></div>
              <div className="archival-card__header">
                <span className="archival-tag">ARCHIVAL DRAFT • PATRIARCH WORKBENCH</span>
                <span className="archival-no">PLATE 01 / GEN I</span>
              </div>

              <div className="archival-sketch-wrap">
                <svg className={`archival-svg ${beginningVisible ? 'draw' : ''}`} viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Bench Outline */}
                  <path d="M30 220 H370 V240 H30 Z" stroke="#C9A646" strokeWidth="1.5" strokeDasharray="600" strokeDashoffset={beginningVisible ? "0" : "600"} className="svg-draw-path" />
                  <path d="M70 220 V110 H330 V220" stroke="#8A877F" strokeWidth="1" strokeDasharray="500" opacity="0.6" className="svg-draw-path" />

                  {/* Crucible & Flame Illustration */}
                  <path d="M110 220 C110 180 150 180 150 220 Z" stroke="#C9A646" strokeWidth="1.5" fill="none" className="svg-draw-path" />
                  <path d="M130 175 C135 160 125 150 130 140 C135 150 140 160 130 175 Z" fill="#D8C58A" opacity="0.8" />

                  {/* Precision Jewel Ring Sketch */}
                  <circle cx="260" cy="155" r="32" stroke="#C9A646" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="260" cy="155" r="25" stroke="#D8C58A" strokeWidth="1" />
                  <polygon points="260,112 267,127 260,142 253,127" stroke="#C9A646" strokeWidth="1.2" fill="none" />

                  {/* Hand-drawn Grid Lines */}
                  <line x1="190" y1="40" x2="190" y2="240" stroke="#8A877F" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                  <line x1="40" y1="155" x2="340" y2="155" stroke="#8A877F" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />

                  {/* Archival Stamp Motif */}
                  <circle cx="330" cy="50" r="18" stroke="#415136" strokeWidth="1" opacity="0.7" />
                  <text x="330" y="54" fontSize="7" fill="#415136" textAnchor="middle" fontFamily="Montserrat" letterSpacing="1">GEN I</text>
                </svg>
              </div>

              <div className="archival-card__footer">
                <p className="archival-caption">
                  "Purity is not measured by sight alone, but by the integrity embedded in every strike of the hammer."
                </p>
                <span className="archival-author">— Founding Patriarch, Kalrav Atelier</span>
              </div>
            </div>
          </div>
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
