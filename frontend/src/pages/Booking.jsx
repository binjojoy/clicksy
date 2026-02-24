import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";
import { Calendar, Clock, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import BookingSuccessOverlay from "../components/BookingSuccessOverlay.jsx";
import "../styles/Booking.css";

const API_BASE_URL = 'http://localhost:5000/api/v1';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photographer } = location.state || {};

  const [formData, setFormData] = useState({ date: "", startTime: "", endTime: "", requirements: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Manage body scroll lock
  useEffect(() => {
    if (showSuccess) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const clientId = localStorage.getItem('user_id'); 
    
    if (!clientId) {
        toast.error("Please login to book.");
        setSubmitting(false);
        return navigate("/login");
    }

    try {
        const payload = {
            client_id: clientId,
            provider_id: photographer.id,
            booking_title: `${photographer.category || 'Photography'} Session`,
            start_time: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
            end_time: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
            total_price: parseFloat(photographer.hourly_rate) || 0,
            special_requirements: formData.requirements,
            status: 'pending'
        };

        const res = await axios.post(`${API_BASE_URL}/bookings`, payload);
        if (res.status === 201 || res.status === 200) setShowSuccess(true);
    } catch (err) {
        toast.error("Booking failed. Please check your network.");
    } finally {
        setSubmitting(false);
    }
  };

  if (!photographer) return null;

  return (
    <div className="booking-page-container">
      <Navbar />
      <main className="booking-wrapper">
        <div className="glass-card booking-form-section">
          <h2>Secure Your Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-grid">
              <div className="booking-group">
                <label><Calendar size={16} /> Date</label>
                <input type="date" required className="booking-input" onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="booking-group">
                <label><Clock size={16} /> Start Time</label>
                <input type="time" required className="booking-input" onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
            </div>
            <div className="booking-group" style={{marginTop: '24px'}}>
              <label><Clock size={16} /> End Time</label>
              <input type="time" required className="booking-input" onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
            <div className="booking-group" style={{marginTop: '24px'}}>
              <label><MessageSquare size={16} /> Requirements</label>
              <textarea className="booking-input booking-textarea" placeholder="Details..." onChange={e => setFormData({...formData, requirements: e.target.value})} />
            </div>
            <button type="submit" className="btn-submit-booking" disabled={submitting}>
              {submitting ? "Processing..." : "Confirm Booking"} <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div className="glass-card summary-card">
          <img src={photographer.image} className="photographer-avatar-lg" alt={photographer.name} />
          <h3 className="text-xl font-bold">{photographer.name}</h3>
          <p className="text-purple-400 text-sm font-semibold uppercase">{photographer.category}</p>
          <div className="price-breakdown">
            <div className="price-row"><span>Rate</span><span>{photographer.price}</span></div>
            <div className="price-row total"><span>Total</span><span>{photographer.price}</span></div>
          </div>
        </div>
      </main>

      <BookingSuccessOverlay 
        isVisible={showSuccess}
        details={{
          photographerName: photographer.name,
          photographerImage: photographer.image,
          category: photographer.category,
          date: formData.date,
          time: `${formData.startTime} - ${formData.endTime}`
        }}
        onHome={() => navigate("/")}
        onMore={() => navigate("/explore")}
      />
      <Footer />
    </div>
  );
};

export default Booking;