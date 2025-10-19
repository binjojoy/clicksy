import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: 'var(--primary-foreground)' }}
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <span className="footer-brand-text">CLICKSY</span>
            </div>
            <p className="text-sm text-muted-foreground">
              One Click, Infinite Possibilities
            </p>
          </div>

          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/portfolio" className="footer-link">Portfolio</Link></li>
              <li><Link to="/booking" className="footer-link">Booking</Link></li>
              <li><Link to="/community" className="footer-link">Community</Link></li>
              <li><Link to="/learn" className="footer-link">Learn</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/marketplace" className="footer-link">Marketplace</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-links space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                hello@clicksy.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 CLICKSY. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
