// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera, Users, BookOpen, ShoppingBag, Calendar, Sparkles,
  ArrowRight, Star, TrendingUp, Award, ChevronDown
} from "lucide-react";
import NavbarHome from "../components/NavbarHome.jsx"; 
import Footer from "../components/Footer.jsx";
import "../styles/HomePage.css"; 

const mockLogout = () => console.log('Mock user logged out from Home page.');

/* ─── Floating ambient orbs (reusable) ─── */
const Orb = ({ style }) => (
  <div className="home-orb" style={style} />
);

/* ─── Reveal-on-scroll wrapper ─── */
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const features = [
    { icon: Camera,      title: "Portfolio Showcase",  description: "Create stunning galleries to showcase your photography work and captivate clients worldwide.", link: "/portfolio" },
    { icon: Calendar,    title: "Easy Booking",        description: "Manage bookings and payments seamlessly — your calendar, your rules.", link: "/booking" },
    { icon: Users,       title: "Collaborate",         description: "Connect with photographers, models, and creative minds across the globe.", link: "/community" },
    { icon: BookOpen,    title: "Learn & Grow",        description: "Access curated tutorials and resources to sharpen your skills at every level.", link: "/learn" },
    { icon: ShoppingBag, title: "Marketplace",         description: "Buy or rent photography gear from a trusted community of professionals.", link: "/marketplace" },
    { icon: Sparkles,    title: "Community",           description: "Join discussions, share experiences, and grow alongside fellow photographers.", link: "/community" },
  ];

  const mockPhotos = [
    { gradient: "linear-gradient(to bottom right, rgba(76,29,149,0.8), rgba(49,46,129,0.8))", label: "Golden Hour" },
    { gradient: "linear-gradient(to bottom right, rgba(159,18,57,0.8), rgba(124,45,18,0.8))", label: "Portraits" },
    { gradient: "linear-gradient(to bottom right, rgba(22,78,99,0.8), rgba(30,58,138,0.8))", label: "Architecture" },
    { gradient: "linear-gradient(to bottom right, rgba(6,78,59,0.8), rgba(19,78,74,0.8))", label: "Nature" },
    { gradient: "linear-gradient(to bottom right, rgba(112,26,117,0.8), rgba(88,28,135,0.8))", label: "Fashion" },
    { gradient: "linear-gradient(to bottom right, rgba(120,53,15,0.8), rgba(113,63,18,0.8))", label: "Street" },
  ];

  const testimonials = [
    { name: "Sarah Chen",   role: "Wedding Photographer",   stars: 5, text: "CLICKSY transformed my business. I went from 3 clients to fully booked within 2 months." },
    { name: "Marcus Webb",  role: "Commercial Photographer", stars: 5, text: "The marketplace is a game changer. Sold my old gear and upgraded my kit in a single weekend." },
    { name: "Priya Nair",   role: "Portrait Artist",        stars: 5, text: "The community forums are incredible — a wealth of knowledge from professionals who actually care." },
  ];

  const renderIcon = (iconName) => {
    const icons = {
      camera: <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />,
      calendar: <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />,
      users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
      book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
      shopping: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
      sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></>,
    };
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[iconName]}
      </svg>
    );
  };

  return (
    <div className="home-wrapper">
      <NavbarHome isAuthenticated={false} onLogout={mockLogout} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="home-grid-overlay" />
        <Orb style={{ width:600, height:600, top:"-10%", left:"-10%", background:"rgba(139, 92, 246, 0.18)", animation:"orbFloat 9s ease-in-out infinite" }} />
        <Orb style={{ width:500, height:500, bottom:"-5%", right:"-8%",  background:"rgba(249, 115, 22, 0.14)",  animation:"orbFloat2 11s ease-in-out infinite" }} />

        <div className="home-container text-center relative z-10">
          <Reveal>
            <h1 style={{ fontSize: 'clamp(6rem, 6vw, 10rem)', fontWeight: '900', lineHeight: '0.95', letterSpacing: '-0.04em', marginBottom: '2rem' }}>
              <span style={{ color: 'white' }}>One </span>
              <span style={{ background: 'linear-gradient(to right, #ff8a00, #e52e71, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Click,</span>
              <br />
              <span style={{ color: 'white' }}>Infinite</span>
              <br />
              <span style={{ background: 'linear-gradient(to right, #8b5cf6, #e52e71, #ff8a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Possibilities</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
              The ultimate platform for photographers to showcase, connect, and grow their business — all in one beautifully crafted space.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/auth" className="home-btn btn-purple">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/explore" className="home-btn btn-dark">
                Explore Portfolios
              </Link>
            </div>

            <div style={{ marginTop: '5rem', opacity: '0.4', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
               <ChevronDown size={16} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── DISCOVER ── */}
      <section className="section-padding">
        <div className="home-container">
          <Reveal className="text-center mb-20">
            <p style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Discover</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Art That Moves <span style={{ background: 'linear-gradient(to right, #ff8a00, #e52e71, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Explore thousands of stunning portfolios from photographers around the world.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {mockPhotos.map((photo, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="discover-card" style={{ background: photo.gradient }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.1)' }}>
                    <Camera size={48} strokeWidth={1.5} />
                  </div>
                  <div className="discover-label">{photo.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-padding">
        <Orb style={{ width:600, height:600, bottom:0, left:"-15%", background:"rgba(139, 92, 246, 0.12)", animation:"orbFloat 12s ease-in-out infinite" }} />
        <div className="home-container">
          <Reveal className="text-center mb-20">
            <p style={{ color: '#8b5cf6', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Everything You <span style={{ background: 'linear-gradient(to right, #8b5cf6, #e52e71, #ff8a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Need</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Powerful tools built specifically for the modern photographer's workflow.
            </p>
          </Reveal>

          <div className="features-grid">
            {features.map((feature, i) => (
              <Reveal key={i} delay={i * 80}>
                <Link to={feature.link} className="premium-card">
                  <div className="card-icon-box">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-desc">{feature.description}</p>
                  <div className="card-link">
                    Learn more &rarr;
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding">
        <div className="home-container">
          <Reveal className="text-center mb-20">
            <p style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Loved by <span style={{ background: 'linear-gradient(to right, #e52e71, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creators</span>
            </h2>
          </Reveal>

          <div className="features-grid">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="premium-card">
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                    {[...Array(t.stars)].map((_, s) => <Star key={s} size={16} fill="#f97316" color="#f97316" />)}
                  </div>
                  <p className="card-desc" style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: '#d4d4d8' }}>"{t.text}"</p>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '90%', position: 'relative', }}>
          <Reveal>
            <div style={{ position: 'absolute', inset: '-15px', background: 'linear-gradient(to right, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.3))', filter: 'blur(50px)', borderRadius: '3rem', zIndex: 0 }}></div>
            <div style={{ position: 'relative', background: '#0c0c0e', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1.5rem', padding: '2rem 2rem', zIndex: 10, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '2rem' }}>
                <TrendingUp size={14} color="#c084fc" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc' }}>Join 48,000+ Photographers</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '1.5rem', color: 'white' }}>
                Ready to Transform Your <br/>
                <span style={{ background: 'linear-gradient(to right, #ec4899, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Photography Career?</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '550px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                Start your free account today and join a thriving community of professionals who are growing their business with CLICKSY.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/auth" className="btn-orange home-btn">
                  <Award size={18} /> Start Free Today <ArrowRight size={18} />
                </Link>
                <Link to="/learn" className="btn-dark home-btn">
                  Browse Tutorials
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;