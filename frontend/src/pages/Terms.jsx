// frontend/src/pages/Terms.jsx
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
    <h2 className="legal-section-title" style={{ color: "hsl(263 70% 75%)" }}>
      <span
        className="legal-section-number"
        style={{
          background: "linear-gradient(135deg, hsl(263 70% 50%), hsl(14 100% 65%))",
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
    <span style={{ color: "hsl(263 70% 60%)" }} className="legal-bullet-icon">▸</span>
    <span>{children}</span>
  </div>
);

const Terms = () => {
  const particles = [
    { top: "8%", left: "5%", size: 16, delay: 0, duration: 8 },
    { top: "15%", left: "88%", size: 20, delay: 1.2, duration: 10 },
    { top: "72%", left: "3%", size: 18, delay: 0.8, duration: 9 },
    { top: "85%", left: "80%", size: 22, delay: 1.8, duration: 11 },
    { top: "5%", left: "50%", size: 14, delay: 1, duration: 7.5 },
  ];

  return (
    <div className="legal-page-container" style={{ background: "hsl(240 10% 3.9%)" }}>
      <FloatingOrb size={500} color="hsl(263 70% 50%)" top="-10%" left="-15%" delay={0} duration={12} />
      <FloatingOrb size={400} color="hsl(14 100% 65%)" top="55%" left="70%" delay={3} duration={14} />
      <FloatingOrb size={300} color="hsl(250 70% 55%)" top="30%" left="60%" delay={6} duration={10} />
      <FloatingOrb size={200} color="hsl(263 70% 50%)" top="80%" left="-5%" delay={1.5} duration={11} />

      <div
        className="legal-grid-overlay"
        style={{
          backgroundImage: `linear-gradient(hsl(263 70% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(263 70% 50%) 1px, transparent 1px)`,
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
                background: "linear-gradient(135deg, hsl(263 70% 50%), hsl(14 100% 65%))",
                boxShadow: "0 8px 32px hsl(263 70% 50% / 0.5)",
              }}
            >
              <Camera size={28} color="white" />
            </div>
            <span
              className="legal-logo-text"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(263 70% 80%) 50%, hsl(14 100% 75%) 100%)",
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
            border: "1px solid hsl(263 70% 50% / 0.2)",
            boxShadow: `0 0 0 1px hsl(263 70% 50% / 0.05),
              0 32px 80px -16px hsl(240 10% 3.9% / 0.8),
              0 0 60px -20px hsl(263 70% 50% / 0.15),
              inset 0 1px 0 hsl(0 0% 100% / 0.06)`,
          }}
        >
          {/* Header */}
          <div className="legal-card-header" style={{ borderBottom: "1px solid hsl(240 6% 14%)" }}>
            <h1 className="legal-card-title">Terms of Service</h1>
            <p className="legal-card-subtitle" style={{ color: "hsl(240 5% 40%)" }}>
              Last Updated: February 2026 &nbsp;·&nbsp; Effective immediately upon account creation
            </p>
          </div>

          {/* Intro */}
          <p className="legal-intro-text" style={{ color: "hsl(240 5% 65%)" }}>
            Welcome to <span style={{ color: "hsl(263 70% 75%)", fontWeight: 600 }}>CLICKSY</span>! We are thrilled to have you join our community. CLICKSY is a comprehensive platform designed to connect photographers, clients, and photography enthusiasts through portfolios, bookings, community forums, learning resources, and a marketplace. By creating an account or using CLICKSY, you agree to these Terms of Service.
          </p>

          <Section number="1" title="Your Account and Identity">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Accuracy:</strong> You must provide accurate and current information when creating your account.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Impersonation:</strong> You may not create an account using someone else's identity, brand, or name, nor misrepresent your affiliations or photography experience.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Account Security:</strong> You are responsible for keeping your login credentials secure. If you suspect unauthorized access, notify us immediately.</BulletItem>
          </Section>

          <Section number="2" title="Content Ownership and Copyright">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>You Own Your Work:</strong> Photographers retain 100% ownership and copyright of all images, videos, and text they upload.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>License to Display:</strong> By uploading content, you grant CLICKSY a non-exclusive, worldwide, royalty-free license to display, host, and format your work solely to operate the platform.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Unauthorized Reuse:</strong> Users may not download, screenshot, scrape, redistribute, or reuse any content without explicit written permission from the copyright owner.</BulletItem>
          </Section>

          <Section number="3" title="Booking Services">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Independent Contractors:</strong> Photographers on CLICKSY are independent professionals, not employees or agents of CLICKSY.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Platform as a Venue:</strong> We provide the tools to connect, but we do not oversee photoshoots. CLICKSY is not responsible for photo quality, behavior, no-shows, or late deliveries.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Disputes:</strong> Any disputes regarding bookings, cancellations, and refunds must be resolved directly between the client and the photographer.</BulletItem>
          </Section>

          <Section number="4" title="The Marketplace">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Buyer Beware:</strong> CLICKSY does not own, inspect, or guarantee the condition or legality of any items listed. All transactions are made at your own risk.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Prohibited Items:</strong> You may not list stolen goods, counterfeit items, illegal materials, or items unrelated to photography.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Transaction Liability:</strong> We are not responsible for shipping issues, damaged goods, or fraudulent listings.</BulletItem>
          </Section>

          <Section number="5" title="Community Forums and Conduct">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Respectful Interaction:</strong> We do not tolerate hate speech, harassment, bullying, doxxing, or discrimination of any kind.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Spam:</strong> Using forums to spam links, aggressively self-promote, or distribute malware is strictly prohibited.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Moderation:</strong> CLICKSY reserves the right to remove any post or suspend forum privileges for users who violate these guidelines.</BulletItem>
          </Section>

          <Section number="6" title="Tutorials and Learning Resources">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Educational Purposes:</strong> Tutorials and guides are for educational purposes. CLICKSY does not guarantee specific results or career advancements.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Intellectual Property:</strong> You may not record, pirate, or distribute premium tutorials or courses found on CLICKSY.</BulletItem>
          </Section>

          <Section number="7" title="The Explore Page and Algorithms">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>Algorithmic Discovery:</strong> CLICKSY may utilize algorithms to power our Explore page, search, and recommendation features.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Guaranteed Visibility:</strong> We do not guarantee specific search rankings, profile visibility, or engagement. Content visibility is determined by automated systems.</BulletItem>
          </Section>

          <Section number="8" title="Financial Transactions & General Liability">
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Financial Involvement:</strong> CLICKSY does not process or guarantee payments between users for bookings, marketplace sales, or paid collaborations.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(0 0% 85%)" }}>No Liability:</strong> CLICKSY holds no responsibility for unpaid invoices, unfulfilled services, scams, or financial disputes between users.</BulletItem>
          </Section>

          <Section number="9" title="Strictly Prohibited Content">
            <BulletItem><strong style={{ color: "hsl(14 100% 70%)" }}>No Adult Content:</strong> Uploading sexually explicit material, pornography, or overly graphic content is strictly prohibited and will result in immediate account termination and permanent ban.</BulletItem>
            <BulletItem><strong style={{ color: "hsl(14 100% 70%)" }}>No Fraud:</strong> Any attempt to defraud users, manipulate systems, or use stolen financial information will be reported to appropriate authorities.</BulletItem>
          </Section>

          <Section number="10" title="Enforcement and Changes to Terms">
            <p>We reserve the right to suspend or terminate any account at any time, without notice, if we believe a user has violated these Terms, engaged in fraudulent activity, or compromised the safety of the CLICKSY community. We may update these terms as CLICKSY grows, and it is your responsibility to review them periodically.</p>
          </Section>

          {/* Footer */}
          <div className="legal-footer" style={{ borderTop: "1px solid hsl(240 6% 14%)" }}>
            <p className="legal-card-subtitle" style={{ color: "hsl(240 5% 35%)" }}>
              © 2026 CLICKSY. All rights reserved.
            </p>
            <div className="legal-footer-links">
              <Link to="/privacy-policy" className="legal-link" style={{ color: "hsl(263 70% 65%)" }}>Privacy Policy</Link>
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

export default Terms;