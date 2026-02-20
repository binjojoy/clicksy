// frontend/src/pages/Privacy.jsx
import { Link } from "react-router-dom";
import { Camera, Aperture, ChevronLeft } from "lucide-react";
import "../styles/Legal.css";

const FloatingOrb = ({ size, color, top, left, delay, duration }) => (
  <div
    className="floating-orb"
    style={{
      width: size, height: size, background: color, top, left,
      animation: `orbFloat ${duration}s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

const ShutterParticle = ({ style }) => (
  <div className="shutter-particle" style={style}>
    <Aperture size={20} />
  </div>
);

const Section = ({ number, title, children }) => (
  <div className="legal-section">
    <h2 className="legal-section-title" style={{ color: "hsl(14 100% 72%)" }}>
      <span
        className="legal-section-number"
        style={{
          background: "linear-gradient(135deg, hsl(14 100% 65%), hsl(263 70% 50%))",
          color: "white",
        }}
      >
        {number}
      </span>
      {title}
    </h2>
    <div className="legal-section-content" style={{ color: "hsl(240 5% 65%)" }}>
      {children}
    </div>
  </div>
);

const BulletItem = ({ children }) => (
  <div className="legal-bullet-item">
    <span style={{ color: "hsl(14 100% 65%)" }} className="legal-bullet-icon">▸</span>
    <span>{children}</span>
  </div>
);

const Privacy = () => {
  const particles = [
    { top: "8%", left: "5%", size: 16, delay: 0, duration: 8 },
    { top: "15%", left: "88%", size: 20, delay: 1.2, duration: 10 },
    { top: "72%", left: "3%", size: 18, delay: 0.8, duration: 9 },
    { top: "85%", left: "80%", size: 22, delay: 1.8, duration: 11 },
    { top: "5%", left: "50%", size: 14, delay: 1, duration: 7.5 },
  ];

  return (
    <div className="legal-page-container" style={{ background: "hsl(240 10% 3.9%)" }}>
      <FloatingOrb size={500} color="hsl(14 100% 65%)" top="-10%" left="-15%" delay={0} duration={12} />
      <FloatingOrb size={400} color="hsl(263 70% 50%)" top="55%" left="70%" delay={3} duration={14} />
      <FloatingOrb size={300} color="hsl(25 100% 60%)" top="30%" left="60%" delay={6} duration={10} />
      <FloatingOrb size={200} color="hsl(14 100% 65%)" top="80%" left="-5%" delay={1.5} duration={11} />

      <div
        className="legal-grid-overlay"
        style={{
          backgroundImage: `linear-gradient(hsl(14 100% 65%) 1px, transparent 1px), linear-gradient(90deg, hsl(14 100% 65%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {particles.map((p, i) => (
        <ShutterParticle key={i} style={{ top: p.top, left: p.left, fontSize: p.size, animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite alternate` }} />
      ))}

      <div className="legal-content-wrapper">
        {/* Logo */}
        <div className="legal-logo-container">
          <Link to="/" className="legal-logo-link">
            <div
              className="legal-logo-icon"
              style={{
                background: "linear-gradient(135deg, hsl(14 100% 65%), hsl(263 70% 50%))",
                boxShadow: "0 8px 32px hsl(14 100% 65% / 0.5)",
              }}
            >
              <Camera size={28} color="white" />
            </div>
            <span
              className="legal-logo-text"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(14 100% 75%) 50%, hsl(263 70% 80%) 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 4s linear infinite",
              }}
            >
              CLICKSY
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="legal-glass-card"
          style={{
            background: "hsl(240 8% 6% / 0.6)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid hsl(14 100% 65% / 0.2)",
            boxShadow: `0 0 0 1px hsl(14 100% 65% / 0.05),
              0 32px 80px -16px hsl(240 10% 3.9% / 0.8),
              0 0 60px -20px hsl(14 100% 65% / 0.15),
              inset 0 1px 0 hsl(0 0% 100% / 0.06)`,
          }}
        >
          {/* Header */}
          <div className="legal-card-header" style={{ borderBottom: "1px solid hsl(240 6% 14%)" }}>
            <h1 className="legal-card-title">Privacy Policy</h1>
            <p className="legal-card-subtitle" style={{ color: "hsl(240 5% 40%)" }}>
              Last Updated: February 2026 &nbsp;·&nbsp; We believe in plain English
            </p>
          </div>

          {/* Intro */}
          <p className="legal-intro-text" style={{ color: "hsl(240 5% 65%)" }}>
            At <span style={{ color: "hsl(14 100% 72%)", fontWeight: 600 }}>CLICKSY</span>, we deeply respect your privacy. Our goal is to provide a seamless, inspiring platform for photographers and clients while being completely transparent about how your data is handled.
          </p>

          <Section number="1" title="The Golden Rule: We Do Not Sell Your Data">
            <p>
              Let's start with the most important point: <strong style={{ color: "hsl(0 0% 90%)" }}>We do not sell your personal data at any cost.</strong> We do not hand over your email, portfolio details, or browsing habits to third-party data brokers, marketers, or advertisers. Your data stays within the CLICKSY ecosystem.
            </p>
          </Section>

          <Section number="2" title="Information We Collect">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Account Data:</strong> When you sign up, we collect basic details like your name, email address, and account type (Client or Photographer).</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Content and Media:</strong> Any images, videos, text, and portfolio details you upload are stored securely on our cloud servers.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Browsing and Usage Data:</strong> We track how you interact with the platform — portfolios you visit, tutorials you watch, or marketplace items you browse.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Communications:</strong> We store messages you send through community forums and direct messaging features.</BulletItem>
          </Section>

          <Section number="3" title="How We Use Your Information">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Platform Operations:</strong> To maintain your portfolio, process your logins, and keep the platform running smoothly.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Personalized Recommendations:</strong> We use your browsing data to power our algorithms and show you relevant photographers, marketplace items, and tutorials.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Security and Support:</strong> To monitor for suspicious activity, prevent fraud, and respond to customer service requests.</BulletItem>
          </Section>

          <Section number="4" title="Important Security Disclosures">
            <div
              style={{
                borderRadius: "0.75rem",
                padding: "1rem",
                marginBottom: "0.75rem",
                background: "hsl(14 100% 65% / 0.08)",
                border: "1px solid hsl(14 100% 65% / 0.2)",
              }}
            >
              <p style={{ color: "hsl(14 100% 72%)", fontSize: "0.75rem", fontWeight: 600, margin: "0 0 0.25rem 0" }}>⚠ Please Read Carefully</p>
              <p style={{ color: "hsl(240 5% 60%)", fontSize: "0.75rem", margin: 0 }}>
                <strong style={{ color: "hsl(0 0% 85%)" }}>Unencrypted Chats:</strong> As of right now, direct messages and community forum chats on CLICKSY are not end-to-end encrypted. Our system administrators technically have the ability to access these logs for moderation purposes. Please do not share sensitive personal or financial information via the chat feature.
              </p>
            </div>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Server Storage:</strong> All portfolio images, marketplace photos, and profile pictures are hosted on our centralized servers to ensure fast loading times.</BulletItem>
          </Section>

          <Section number="5" title="Publicly Shared Information">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Think Before You Post:</strong> Information you post on your public portfolio, community forums, and marketplace listings can be seen by anyone on the internet.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Your Responsibility:</strong> We are not responsible for what third parties do with information you willingly choose to make public. Exercise caution when sharing personal contact details or location data in public areas.</BulletItem>
          </Section>

          <Section number="6" title="Account Termination and Data Retention">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Violations:</strong> If an account violates our Terms of Service, we reserve the right to immediately terminate the account.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Data Deletion:</strong> Upon account deletion or termination, we will remove your public-facing portfolio and marketplace listings. However, we may retain certain administrative data (like email logs or ban records) for legal and security purposes.</BulletItem>
          </Section>

          <Section number="7" title="Changes to This Policy">
            <p>As CLICKSY grows and adds new features, we may update this Privacy Policy. We will notify you of any significant changes, but we encourage you to review this page periodically.</p>
          </Section>

          {/* Footer */}
          <div className="legal-footer" style={{ borderTop: "1px solid hsl(240 6% 14%)" }}>
            <p className="legal-card-subtitle" style={{ color: "hsl(240 5% 35%)" }}>
              © 2026 CLICKSY. All rights reserved.
            </p>
            <div className="legal-footer-links">
              <Link to="/terms-and-conditions" className="legal-link" style={{ color: "hsl(14 100% 65%)" }}>Terms of Service</Link>
              <Link to="/auth" className="legal-link" style={{ color: "hsl(240 5% 45%)" }}>Back to Sign In</Link>
            </div>
          </div>
        </div>

        <div className="legal-back-container">
          <Link to="/" className="legal-back-link" style={{ color: "hsl(240 5% 45%)" }}>
            <ChevronLeft size={16} />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;