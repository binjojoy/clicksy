// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './Navbar.css';
import { User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ⚡ 1. Check if user is actually authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("userToken");
  });

  // ⚡ 2. Read role directly from storage
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole"); 
  });

  // Listen for storage changes across tabs (keeps Navbar synced)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("userToken"));
      setUserRole(localStorage.getItem("userRole"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- 3. MENU DEFINITIONS ---
  const photographerLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/portfolio", label: "Portfolio" }, 
    { path: "/booking", label: "Bookings" },    
    { path: "/community", label: "Community" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/learn", label: "Learn" },
  ];

  const clientLinks = [
    { path: "/dashboard", label: "Home" },
    { path: "/explore", label: "Explore" },      
    { path: "/my-bookings", label: "My Bookings" }, 
    { path: "/saved", label: "Saved" },          
  ];

  // ⚡ 4. DYNAMIC ROUTING LOGIC
  const navLinks = isAuthenticated 
    ? (userRole === "photographer" ? photographerLinks : clientLinks)
    : [];

  const isActive = (path) => location.pathname === path;

  // ⚡ 5. LOGOUT LOGIC
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole"); 
    localStorage.removeItem("userName");
    localStorage.removeItem("user_id");
    
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        
        {/* === LOGO === */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <span className="logo-text">CLICKSY</span> 
        </Link>

        {/* === DESKTOP NAVIGATION === */}
        <div className="nav-links-desktop hidden md:flex" style={{ display: 'flex', flexGrow: 1, justifyContent: navLinks.length > 0 ? 'space-between' : 'flex-end', alignItems: 'center' }}>
          
          {/* Render Links (Only visible if logged in) */}
          {navLinks.length > 0 && (
            <div className="navbar-links flex gap-6 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="nav-auth-desktop flex gap-4 ml-auto">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* Profile Link */}
                <Link 
                    to="/profiles" 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        color: '#e5e7eb', 
                        textDecoration: 'none', 
                        fontWeight: 500, 
                        fontSize: '0.95rem', 
                        transition: 'color 0.2s' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#7c3aed'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#e5e7eb'}
                >
                  <User size={18} /> Profile
                </Link>
                {/* Logout Button */}
                <button onClick={handleLogout} className="btn-signup" style={{ cursor: 'pointer' }}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/auth" className="btn-login">Login</Link>
                <Link to="/auth" className="btn-signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* === MOBILE MENU TOGGLE BUTTON === */}
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

      {/* === MOBILE MENU DROPDOWN === */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        
        {/* Render Mobile Links */}
        <div className="flex flex-col mb-4">
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
        </div>

        {/* Mobile Auth Buttons */}
        <div className="nav-auth-mobile flex flex-col gap-3 border-t border-gray-800 pt-4">
            {isAuthenticated ? (
                <>
                    <Link 
                        to="/profiles" 
                        className="mobile-menu-link" 
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <User size={18} /> Profile
                    </Link>
                    <button 
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="btn-signup w-full"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/auth" className="btn-login w-full text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/auth" className="btn-signup w-full text-center" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;