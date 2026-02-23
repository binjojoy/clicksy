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
    { image: "https://images.unsplash.com/photo-1500673922987-e212871fec22", label: "Golden Hour" },
    { image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04", label: "Portraits" },
    { image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", label: "Architecture" },
    { image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", label: "Nature" },
    { image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b", label: "Fashion" },
    { image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb", label: "Street" },
  ];

  const testimonials = [
    { name: "Sarah Chen",   role: "Wedding Photographer",   stars: 5, text: "CLICKSY transformed my business. I went from 3 clients to fully booked within 2 months." },
    { name: "Marcus Webb",  role: "Commercial Photographer", stars: 5, text: "The marketplace is a game changer. Sold my old gear and upgraded my kit in a single weekend." },
    { name: "Priya Nair",   role: "Portrait Artist",        stars: 5, text: "The community forums are incredible — a wealth of knowledge from professionals who actually care." },
  ];

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
              <Link to="/portfolio" className="home-btn btn-dark">
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
          <Reveal className="text-center header-bottom-margin">
            <p style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Discover</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Art That Moves <span style={{ background: 'linear-gradient(to right, #ff8a00, #e52e71, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>You</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Explore thousands of stunning portfolios from photographers around the world.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {mockPhotos.map((photo, i) => (
              <Reveal key={i} delay={i * 80}>
                <div 
                  className="discover-card" 
                  style={{ 
                    backgroundImage: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.9)), url(${photo.image})` 
                  }}
                >
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
          <Reveal className="text-center header-bottom-margin">
            <p style={{ color: '#8b5cf6', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Everything You <span style={{ background: 'linear-gradient(to right, #8b5cf6, #e52e71, #ff8a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Need</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#a1a1aa', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Powerful tools built specifically for the modern photographer's workflow.
            </p>
          </Reveal>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
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
          <Reveal className="text-center header-bottom-margin">
            <p style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(3.5rem, 3vw, 6rem)', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: '1', color: 'white' }}>
              Loved by <span style={{ background: 'linear-gradient(to right, #e52e71, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creators</span>
            </h2>
          </Reveal>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
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
      <section className="section-padding">
        <div className="home-container">
          <Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-15px', background: 'linear-gradient(to right, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.3))', filter: 'blur(50px)', borderRadius: '3rem', zIndex: 0 }}></div>
              <div style={{ position: 'relative', background: '#0c0c0e', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1.5rem', padding: '6rem 2rem', zIndex: 10, textAlign: 'center' }}>
                
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
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;