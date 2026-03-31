// frontend/src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Camera, ArrowLeft, MapPinOff } from "lucide-react";
import "../styles/Auth.css"; // Reusing your existing CSS!

const FloatingOrb = ({ size, color, top, left, delay, duration }) => (
  <div
    className="floating-orb"
    style={{
      width: size, height: size, background: color, top, left,
      animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

const NotFound = () => {
    return (
        <div className="auth-page-container">
            {/* Background Orbs */}
            <FloatingOrb size={500} color="#4f46e5" top="-10%" left="-10%" delay={0} duration={12} />
            <FloatingOrb size={400} color="#f97316" top="auto" bottom="-10%" left="auto" right="-10%" delay={2} duration={10} />
            
            {/* Subtle Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

            <div className="auth-content-wrapper" style={{ textAlign: 'center' }}>
                {/* Logo Section */}
                <Link to="/" className="auth-logo-section">
                    <div className="auth-logo-icon">
                        <Camera size={28} />
                    </div>
                    <h1 className="auth-logo-text">CLICKSY</h1>
                </Link>

                {/* Glass Card */}
                <div className="auth-glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
                    
                    <div style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        padding: '1.5rem', 
                        borderRadius: '50%', 
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <MapPinOff size={48} color="#f97316" />
                    </div>

                    <h1 style={{ fontSize: '4rem', fontWeight: 900, margin: '0 0 0.5rem 0', background: 'linear-gradient(135deg, #ffffff, #a1a1aa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        404
                    </h1>
                    
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        Page Not Found
                    </h2>
                    
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        Oops! The page you are looking for seems to have wandered out of frame. It might have been removed, renamed, or didn't exist in the first place.
                    </p>

                    <Link to="/" style={{ width: '100%', textDecoration: 'none' }}>
                        <button className="auth-submit-btn btn-signin" style={{ justifyContent: 'center' }}>
                            <ArrowLeft size={18} />
                            Back to Safety
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;