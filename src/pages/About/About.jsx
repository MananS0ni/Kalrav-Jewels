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
  {
    gen: '01',
    year: 'GENERATION 1',
    title: 'The Beginning — Founding Patriarch',
    desc: 'Our family heritage began with our founding patriarch at a single hand-hammering workbench, establishing our sacred commitment to metal purity and trust.',
    badge: 'HANDCRAFT ERA • EST. 1952',
    iconType: 'gen1'
  },
  {
    gen: '02',
    year: 'GENERATION 2',
    title: 'Artisan Expansion & Filigree',
    desc: 'Expanding our family artistry across precious gold and silver jewellery, building lifelong bonds with local families through intricate hand filigree.',
    badge: 'EXPANDED ATELIER',
    iconType: 'gen2'
  },
  {
    gen: '03',
    year: 'GENERATION 3',
    title: 'Mastery, Gemstones & Technique',
    desc: 'Refining micro-chisel setting, optic loupe stone inspection, and traditional metalworking techniques passed down directly from our patriarch.',
    badge: 'GEMSTONE MASTERY',
    iconType: 'gen3'
  },
  {
    gen: '04',
    year: 'GENERATION 4',
    title: 'Retail Excellence & Storefront',
    desc: 'Solidifying our physical presence with trusted storefront craftsmanship, personalized family service, and 100% certified hallmarked purity.',
    badge: 'TRUSTED STOREFRONT',
    iconType: 'gen4'
  },
  {
    gen: '05',
    year: 'GENERATION 5 (2026)',
    title: 'The Digital Horizon — Kalrav Jewels',
    desc: 'Carrying four generations of family legacy into the digital age with Kalrav Jewels online, specializing exclusively in hallmarked 925 sterling silver for the modern world.',
    badge: 'DIGITAL INNOVATION',
    iconType: 'gen5'
  }
];

const pillars = [
  {
    num: '01',
    title: 'Certified Purity',
    desc: 'Every 925 sterling silver piece is hallmarked for lifetime authenticity and trust.',
    tag: 'HALLMARKED 925'
  },
  {
    num: '02',
    title: 'Artisanal Heritage',
    desc: 'Each design honours four generations of handmade metalworking tradition passed from our founding patriarch to present day.',
    tag: 'FOUR GENERATIONS'
  },
  {
    num: '03',
    title: 'Modern Precision',
    desc: 'Combining old-world forging with laser technology to build jewellery engineered for daily wear.',
    tag: 'MICRON ACCURACY'
  },
  {
    num: '04',
    title: 'Unbroken Trust',
    desc: 'Four generations of family integrity, transparent pricing, and direct-to-customer care.',
    tag: 'FAMILY INTEGRITY'
  }
];

const About = () => {
  // Slider state (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [beginningVisible, setBeginningVisible] = useState(false);
  const [activeTimelineNodes, setActiveTimelineNodes] = useState([]);
  const [activePillars, setActivePillars] = useState([]);

  const sliderRef = useRef(null);
  const beginningRef = useRef(null);
  const timelineRef = useRef(null);

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

    // Part 2 Timeline Node Observer
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const nodeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActiveTimelineNodes((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineNodes.forEach((node) => nodeObserver.observe(node));

    // Part 2 Pillar Observer
    const pillarCards = document.querySelectorAll('.pillar-card');
    const pillarObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setActivePillars((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    pillarCards.forEach((card) => pillarObserver.observe(card));

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      observer.disconnect();
      nodeObserver.disconnect();
      pillarObserver.disconnect();
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

      {/* Part 2: Section 3 — Generations Timeline */}
      <section className="timeline-redesign-section" id="timeline" ref={timelineRef}>
        <div className="container">
          <div className="timeline-header text-center">
            <span className="timeline-eyebrow">FOUR GENERATIONS OF PASSION</span>
            <h2 className="timeline-heading">From Generation to Generation</h2>
            <div className="heritage-hero__gold-divider" style={{ margin: '16px auto 0', width: '120px' }}>
              <span className="gold-divider-diamond">◆</span>
            </div>
            <p className="timeline-subtitle">
              Follow our family journey as traditional hand-hammering evolves into modern 925 sterling silver mastery.
            </p>
          </div>

          <div className="timeline-wrapper">
            {/* Antique Gold Central Progress Line */}
            <div className="timeline-central-line">
              <div
                className="timeline-progress-bar"
                style={{
                  height: `${Math.min(100, (activeTimelineNodes.length / milestones.length) * 100)}%`
                }}
              ></div>
            </div>

            {milestones.map((m, idx) => {
              const isActive = activeTimelineNodes.includes(idx);
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  data-index={idx}
                  className={`timeline-node ${isEven ? 'timeline-node--left' : 'timeline-node--right'} ${isActive ? 'active' : ''}`}
                >
                  {/* Node Content Card */}
                  <div className="timeline-node-card">
                    <div className="node-card-header">
                      <span className="node-gen-badge">{m.year}</span>
                      <span className="node-tag">{m.badge}</span>
                    </div>
                    <h3 className="node-title">{m.title}</h3>
                    <p className="node-desc">{m.desc}</p>
                  </div>

                  {/* Central Node Marker */}
                  <div className="timeline-node-marker">
                    <div className="marker-ring">
                      <span className="marker-num">{m.gen}</span>
                    </div>
                  </div>

                  {/* Evolving Vector Craftsmanship Visual */}
                  <div className="timeline-node-visual">
                    <div className="node-svg-box">
                      {m.iconType === 'gen1' && (
                        <svg viewBox="0 0 160 120" fill="none" className="node-svg">
                          <path d="M20 90 H140 V100 H20 Z" stroke="#C9A646" strokeWidth="1.2" />
                          <path d="M50 90 V50 H110 V90" stroke="#8A877F" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                          <path d="M70 90 C70 65 90 65 90 90 Z" stroke="#C9A646" strokeWidth="1.2" />
                          <path d="M80 62 C83 50 77 42 80 35 C83 42 86 50 80 62 Z" fill="#D8C58A" opacity="0.8" />
                        </svg>
                      )}
                      {m.iconType === 'gen2' && (
                        <svg viewBox="0 0 160 120" fill="none" className="node-svg">
                          <circle cx="80" cy="60" r="40" stroke="#C9A646" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx="80" cy="60" r="28" stroke="#D8C58A" strokeWidth="1.2" />
                          <path d="M80 20 V100 M20 60 H140" stroke="#8A877F" strokeWidth="0.5" opacity="0.5" />
                          <path d="M60 60 Q80 40 100 60 Q80 80 60 60 Z" stroke="#C9A646" strokeWidth="1" fill="none" />
                        </svg>
                      )}
                      {m.iconType === 'gen3' && (
                        <svg viewBox="0 0 160 120" fill="none" className="node-svg">
                          <circle cx="80" cy="55" r="30" stroke="#C9A646" strokeWidth="1.5" />
                          <polygon points="80,15 90,35 80,55 70,35" stroke="#D8C58A" strokeWidth="1.2" fill="none" />
                          <line x1="80" y1="55" x2="80" y2="105" stroke="#8A877F" strokeWidth="1" />
                          <path d="M60 95 L80 105 L100 95" stroke="#C9A646" strokeWidth="1.2" />
                        </svg>
                      )}
                      {m.iconType === 'gen4' && (
                        <svg viewBox="0 0 160 120" fill="none" className="node-svg">
                          <rect x="30" y="30" width="100" height="60" rx="4" stroke="#415136" strokeWidth="1.5" />
                          <circle cx="80" cy="60" r="18" stroke="#C9A646" strokeWidth="1.2" />
                          <path d="M72 60 L78 66 L88 54" stroke="#D8C58A" strokeWidth="1.5" />
                          <text x="80" y="105" fontSize="8" fill="#415136" textAnchor="middle" fontFamily="Montserrat" letterSpacing="1">HALLMARK</text>
                        </svg>
                      )}
                      {m.iconType === 'gen5' && (
                        <svg viewBox="0 0 160 120" fill="none" className="node-svg">
                          <circle cx="80" cy="60" r="38" stroke="#C9A646" strokeWidth="1.5" strokeDasharray="4 2" />
                          <circle cx="80" cy="60" r="26" stroke="#D8C58A" strokeWidth="1.2" />
                          <polygon points="80,24 88,40 80,56 72,40" fill="#C9A646" opacity="0.9" />
                          <path d="M40 60 H120 M80 20 V100" stroke="#D8C58A" strokeWidth="0.5" opacity="0.4" />
                          <text x="80" y="112" fontSize="7" fill="#C9A646" textAnchor="middle" fontFamily="Montserrat" letterSpacing="2">2026 DIGITAL</text>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Part 2: Section 4 — Four Pillars of Evolution */}
      <section className="pillars-section" id="pillars">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '60px' }}>
            <span className="beginning-eyebrow">OUR UNWAVERING PROMISE</span>
            <h2 className="section-title" style={{ marginTop: '12px' }}>The Four Pillars of Evolution</h2>
            <div className="heritage-hero__gold-divider" style={{ margin: '16px auto 0', width: '120px' }}>
              <span className="gold-divider-diamond">◆</span>
            </div>
            <p className="section-subtitle" style={{ maxWidth: '600px', margin: '14px auto 0' }}>
              Four fundamental principles passed down from our founding patriarch, defining every piece of Kalrav Jewels jewellery.
            </p>
          </div>

          <div className="pillars-grid">
            {pillars.map((p, i) => {
              const isActive = activePillars.includes(i);

              return (
                <div
                  key={i}
                  data-index={i}
                  className={`pillar-card ${isActive ? 'active' : ''}`}
                >
                  <div className="pillar-card__top">
                    <span className="pillar-number">{p.num}</span>
                    <span className="pillar-tag">{p.tag}</span>
                  </div>

                  <h3 className="pillar-title">{p.title}</h3>
                  <div className="pillar-gold-line"></div>
                  <p className="pillar-desc">{p.desc}</p>

                  {/* Emerging Vector SVG Motif on Hover / Touch */}
                  <div className="pillar-svg-wrap">
                    {i === 0 && (
                      <svg viewBox="0 0 100 100" fill="none" className="pillar-svg">
                        <circle cx="50" cy="50" r="40" stroke="#C9A646" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="28" stroke="#D8C58A" strokeWidth="1.2" />
                        <polygon points="50,22 58,38 50,54 42,38" fill="#C9A646" opacity="0.8" />
                        <text x="50" y="85" fontSize="7" fill="#415136" textAnchor="middle" fontFamily="Montserrat" letterSpacing="1">925</text>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 100 100" fill="none" className="pillar-svg">
                        <path d="M20 75 H80 V82 H20 Z" stroke="#C9A646" strokeWidth="1.2" />
                        <path d="M40 75 V45 H60 V75" stroke="#8A877F" strokeWidth="1" />
                        <path d="M50 45 C50 25 65 25 65 45 Z" stroke="#D8C58A" strokeWidth="1.2" fill="none" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 100 100" fill="none" className="pillar-svg">
                        <circle cx="50" cy="50" r="36" stroke="#C9A646" strokeWidth="1" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#D8C58A" strokeWidth="0.75" strokeDasharray="2 2" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#D8C58A" strokeWidth="0.75" strokeDasharray="2 2" />
                        <rect x="38" y="38" width="24" height="24" stroke="#415136" strokeWidth="1" fill="none" />
                      </svg>
                    )}
                    {i === 3 && (
                      <svg viewBox="0 0 100 100" fill="none" className="pillar-svg">
                        <path d="M50 15 L80 30 V60 L50 85 L20 60 V30 Z" stroke="#C9A646" strokeWidth="1.2" fill="none" />
                        <circle cx="50" cy="48" r="14" stroke="#D8C58A" strokeWidth="1" />
                        <path d="M45 48 L48 52 L56 42" stroke="#415136" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
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
              Drag the slider below to scrub through time — see how our traditional hand forging morphed into modern 2026 precision technology.
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
            {/* Heritage Side (Underneath / Background) */}
            <div className="era-panel era-panel--past">
              <div className="era-content">
                <span className="era-year-badge era-year-badge--past">HERITAGE ERA • EST. GENERATION 1</span>
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
                <span className="era-year-badge era-year-badge--modern">2026 • THE DIGITAL HORIZON</span>
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
              <div className="era-slider-handle" title="Drag to compare Heritage vs 2026">
                <span className="handle-arrow">◄</span>
                <span className="handle-text">HERITAGE | 2026</span>
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
              Explore how each fundamental stage of making Kalrav Jewels evolved across four generations of family dedication.
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
              <div className="craft-badge">Patriarch Traditional Method</div>
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

      {/* CTA Section */}
      <section className="about-cta" id="about-cta-section">
        <div className="container about-cta__inner">
          <div>
            <p className="section-label" style={{ color: 'var(--gold-light)' }}>Explore The Craft</p>
            <div className="gold-line-center" style={{ margin: '14px auto' }}></div>
            <h2 className="about-cta__title">Experience Four Generations of Artistry</h2>
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
