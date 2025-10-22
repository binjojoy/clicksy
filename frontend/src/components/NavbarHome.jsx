// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import './Navbar.css';
// 💡 IMPORTANT: Ensure you have 'import './Navbar.css';' in this file for styles to work.

// The component accepts authentication props for the Logout feature.
const NavbarHome = ({ isAuthenticated, onLogout }) => { 
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The navLinks array is no longer used for rendering links, but remains defined.
  const navLinks = []; // Empty the list of links

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logo-icon" 
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <span className="logo-text">CLICKSY</span> 
        </Link>

        {/* DESKTOP LINKS & AUTH CONTAINER */}
        <div className="nav-links-desktop"> 
            {/* The space where the navigation links used to be is now empty, 
                allowing the auth buttons to float right correctly. */}
            
            {/* Auth Buttons Group (Includes Login/Logout and Sign Up) */}
            <div className="nav-auth-desktop">
                {isAuthenticated ? (
                    // SHOW LOGOUT BUTTON
                    <button onClick={onLogout} className="btn-signup">
                        Logout
                    </button>
                ) : (
                    // SHOW LOGIN AND SIGN UP
                    <>
                        {/* Login Link */}
                        <Link to="/auth" className="btn-login">
                            Login
                        </Link>
                        {/* Sign Up Button (styled like a button) */}
                        <Link to="/auth" className="btn-signup">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </div>

        <button
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {/* SVG logic (unchanged) */}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Mobile Nav Links section is now empty based on your request */}
        {/* If you want the auth buttons to be full width, keep the div below: */}
        <div className="nav-auth-mobile">
            {isAuthenticated ? (
                <button 
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="btn-signup"
                >
                    Logout
                </button>
            ) : (
                <>
                    <Link to="/auth" className="btn-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/auth" className="btn-signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;