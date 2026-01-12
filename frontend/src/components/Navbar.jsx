// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ⚡ INSTANT CHECK: Read role directly from storage. 
  // This prevents the "flicker" because it happens before the component renders.
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "client"; 
  });

  // Optional: Listen for storage changes (helpful if you have multiple tabs open)
  useEffect(() => {
    const handleStorageChange = () => {
        setUserRole(localStorage.getItem("userRole"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- MENU DEFINITIONS ---

  // Menu for PHOTOGRAPHERS (Business Owners)
  const photographerLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/portfolio", label: "Portfolio" }, 
    { path: "/booking", label: "Bookings" },    
    { path: "/community", label: "Community" },
    { path: "/marketplace", label: "Marketplace" },
  ];

  // Menu for CLIENTS (Customers)
  const clientLinks = [
    { path: "/dashboard", label: "Home" },
    { path: "/explore", label: "Explore" },      
    { path: "/my-bookings", label: "My Bookings" }, 
    { path: "/saved", label: "Saved" },          
  ];

  // Select the correct menu immediately based on the state
  const navLinks = userRole === "photographer" ? photographerLinks : clientLinks;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // 🧹 CLEANUP: Remove all user data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole"); 
    localStorage.removeItem("userName");
    localStorage.removeItem("user_id");
    
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--primary-foreground)" }}
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <span className="navbar-logo-text">CLICKSY</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn btn-primary btn-sm ml-4">
            Log Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-menu-link ${isActive(link.path) ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            handleLogout();
          }}
          className="btn btn-primary w-full mt-4"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;