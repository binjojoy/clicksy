// frontend/src/pages/NetworkError.jsx
import { Link } from "react-router-dom";
import { Camera, WifiOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import "../styles/Auth.css"; 

const FloatingOrb = ({ size, color, top, left, delay, duration }) => (
  <div
    className="floating-orb"
    style={{
      width: size, height: size, background: color, top, left,
      animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

const NetworkError = () => {
    const [reloading, setReloading] = useState(false);

    const handleRetry = () => {
        setReloading(true);
        // Simulate a tiny delay so the button spin animation is visible, then refresh
        setTimeout(() => {
            window.location.reload();
        }, 800);
    };

    return (
        <div className="auth-page-container">
            <FloatingOrb size={500} color="#ef4444" top="-10%" left="-10%" delay={0} duration={12} /> {/* Red Orb for Error */}
            <FloatingOrb size={400} color="#f97316" top="auto" bottom="-10%" left="auto" right="-10%" delay={2} duration={10} />
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

            <div className="auth-content-wrapper" style={{ textAlign: 'center' }}>
                <Link to="/" className="auth-logo-section">
                    <div className="auth-logo-icon">
                        <Camera size={28} />
                    </div>
                    <h1 className="auth-logo-text">CLICKSY</h1>
                </Link>

                <div className="auth-glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
                    
                    <div style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', // Soft red background
                        padding: '1.5rem', 
                        borderRadius: '50%', 
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                        <WifiOff size={48} color="#ef4444" />
                    </div>
                    
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        Connection Lost
                    </h2>
                    
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                        We couldn't connect to the CLICKSY servers. Please check your internet connection or try again later.
                    </p>

                    <button 
                        onClick={handleRetry} 
                        disabled={reloading}
                        className="auth-submit-btn btn-signup" 
                        style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
                    >
                        {reloading ? (
                            <RefreshCw size={18} className="spinner" style={{ animation: 'spin 1s linear infinite', border: 'none' }} />
                        ) : (
                            <>
                                <RefreshCw size={18} />
                                Try Again
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NetworkError;