import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, Home, Search, Sparkles, User } from "lucide-react";
import confetti from "canvas-confetti";

const BookingSuccessOverlay = ({ isVisible, details, onHome, onMore }) => {
  
  // High-end Confetti Burst
  useEffect(() => {
    if (isVisible) {
      const count = 200;
      const defaults = { origin: { y: 0.7 }, zIndex: 10001 };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="glass-overlay-wrapper">
          {/* Deep Material Blur Backdrop */}
          <motion.div 
            className="glass-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div 
            className="material-glass-card"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="glass-success-header">
              <div className="glass-check-icon">
                <CheckCircle size={40} strokeWidth={1.5} />
              </div>
              <h2>Booking Confirmed!</h2>
              <p>Your session request has been sent successfully.</p>
            </div>

            <div className="glass-receipt-container">
              <div className="receipt-row">
                <div className="receipt-icon-box"><User size={18} /></div>
                <div className="receipt-info">
                  <span className="receipt-label">Artist</span>
                  <span className="receipt-value">{details.photographerName}</span>
                </div>
              </div>

              <div className="receipt-row">
                <div className="receipt-icon-box"><Sparkles size={18} /></div>
                <div className="receipt-info">
                  <span className="receipt-label">Service</span>
                  <span className="receipt-value">{details.category}</span>
                </div>
              </div>

              <div className="receipt-row">
                <div className="receipt-icon-box"><Calendar size={18} /></div>
                <div className="receipt-info">
                  <span className="receipt-label">Date</span>
                  <span className="receipt-value">{details.date}</span>
                </div>
              </div>

              <div className="receipt-row">
                <div className="receipt-icon-box"><Clock size={18} /></div>
                <div className="receipt-info">
                  <span className="receipt-label">Time Slot</span>
                  <span className="receipt-value">{details.time}</span>
                </div>
              </div>
            </div>

            <div className="glass-actions">
              <button onClick={onHome} className="glass-btn secondary">
                <Home size={18} /> Home
              </button>
              <button onClick={onMore} className="glass-btn primary">
                <Search size={18} /> Book More
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessOverlay;