import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js";
import { 
  Calendar, Clock, MapPin, Search, CheckCircle, XCircle, AlertCircle, Star, MessageSquare 
} from "lucide-react";
import "../styles/ClientBooking.css";

const ClientBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      setLoading(true);
      const userId = localStorage.getItem('user_id');
      try {
        const { data } = await api.get(`/bookings/client/${userId}`);
        setBookings(data || []);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchMyBookings();
  }, []);

  const formatStubDate = (isoString) => {
    const date = new Date(isoString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate().toString().padStart(2, '0'),
      year: date.getFullYear(),
      time: date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = 
      activeTab === "upcoming" ? ["confirmed", "pending"].includes(booking.status) :
      activeTab === "history" ? ["completed"].includes(booking.status) :
      activeTab === "cancelled" ? ["cancelled"].includes(booking.status) : true;
    return matchesTab && (booking.photographer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.booking_title?.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="client-booking-root">
      <Navbar />
      <main className="booking-main-compact">
        <div className="compact-wrapper">
          
          <header className="compact-header">
            <div>
              <h1 className="compact-title">My Bookings</h1>
              <p className="compact-subtitle">Manage your sessions and view past history</p>
            </div>
            <button className="solid-glass-btn" onClick={() => navigate('/explore')}>
              + Book New Session
            </button>
          </header>

          <div className="compact-toolbar glass-panel">
            <div className="compact-tabs">
              {['upcoming', 'history', 'cancelled'].map(tab => (
                <button 
                  key={tab} 
                  className={`compact-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="compact-search">
              <Search size={14} />
              <input 
                placeholder="Search sessions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="booking-content-area">
            {loading ? (
               <div className="compact-loader">Syncing schedule...</div>
            ) : filteredBookings.length > 0 ? (
              <div className="compact-grid">
                {filteredBookings.map(booking => {
                  const dateInfo = formatStubDate(booking.start_time);
                  return (
                    <div key={booking.id} className="compact-glass-card">
                      <div className="compact-stub">
                        <span className="stub-m">{dateInfo.month}</span>
                        <span className="stub-d">{dateInfo.day}</span>
                      </div>
                      <div className="compact-body">
                        <div className="body-top">
                          <span className="ref-id">REF: {booking.id.slice(0, 8)}</span>
                          <span className={`mini-badge status-${booking.status}`}>{booking.status}</span>
                        </div>
                        <h3 className="compact-event-title">{booking.booking_title}</h3>
                        <div className="compact-meta">
                          <span>{booking.photographer_name}</span>
                          <span className="meta-sep">•</span>
                          <span>{dateInfo.time}</span>
                        </div>
                        <div className="compact-footer">
                          <span className="price">₹{booking.total_price}</span>
                          <div className="action-row">
                            <button className="icon-btn-glass"><MessageSquare size={14} /></button>
                            <button className="compact-btn-details" onClick={() => navigate(`/booking-details/${booking.id}`)}>Details</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="compact-empty-state glass-panel">
                <div className="empty-icon-box"><Calendar size={32} /></div>
                <h2 className="empty-h2">No {activeTab} bookings found</h2>
                <p className="empty-p">Ready to fill your schedule with new sessions?</p>
                <button className="refined-action-btn" onClick={() => navigate('/explore')}>
                  Find a Photographer
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientBooking;