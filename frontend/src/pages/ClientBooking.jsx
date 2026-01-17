// src/pages/ClientBooking.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Calendar, Clock, MapPin, Search, MoreVertical, MessageSquare, XCircle, CheckCircle, AlertCircle, Camera, Star
} from "lucide-react";
import "./ClientBooking.css";

const ClientBooking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock Data
  const [bookings, setBookings] = useState([
    { 
      id: "BK-2025-001", photographer: "Elena Fisher", avatar: "EF", category: "Wedding Shoot", 
      date: "Oct 24, 2025", day: "24", month: "OCT", time: "10:00 AM", duration: "8 Hours",
      location: "Grand Hyatt, Kochi", status: "confirmed", price: "₹15,000"
    },
    { 
      id: "BK-2025-002", photographer: "Arjun Kapoor", avatar: "AK", category: "Portrait Session", 
      date: "Nov 02, 2025", day: "02", month: "NOV", time: "02:00 PM", duration: "2 Hours",
      location: "Cubbon Park, Bangalore", status: "pending", price: "₹4,000"
    },
    { 
      id: "BK-2024-001", photographer: "Sarah Jenkins", avatar: "SJ", category: "Fashion Portfolio", 
      date: "Sep 15, 2024", day: "15", month: "SEP", time: "09:00 AM", duration: "4 Hours",
      location: "Hauz Khas, Delhi", status: "completed", price: "₹12,000", rating: 5
    },
    { 
      id: "BK-2024-005", photographer: "David Chen", avatar: "DC", category: "Event Coverage", 
      date: "Aug 10, 2024", day: "10", month: "AUG", time: "06:00 PM", duration: "5 Hours",
      location: "Marina Beach, Chennai", status: "cancelled", price: "₹8,000"
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 600);
  }, []);

  // Filter Logic
  const filteredBookings = bookings.filter(booking => {
    const matchesTab = 
      activeTab === "upcoming" ? ["confirmed", "pending"].includes(booking.status) :
      activeTab === "history" ? ["completed"].includes(booking.status) :
      activeTab === "cancelled" ? ["cancelled"].includes(booking.status) : true;

    const matchesSearch = booking.photographer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
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
    <div className="page-container bg-black">
      <Navbar />

      <main className="booking-main">
        <div className="content-wrapper">
          
          {/* --- HEADER --- */}
          <div className="booking-header">
            <div>
              <h1 className="page-title">My Bookings</h1>
              <p className="text-muted">Manage your sessions and view past history.</p>
            </div>
            <button className="btn-new-booking" onClick={() => navigate('/explore')}>
              + Book New Session
            </button>
          </div>

          {/* --- CONTROLS ROW --- */}
          <div className="controls-row">
            {/* Tabs */}
            <div className="booking-tabs">
              {['upcoming', 'history', 'cancelled'].map(tab => (
                <button 
                  key={tab} 
                  className={`tab-pill ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="booking-search">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* --- BOOKING LIST --- */}
          <div className="booking-list-container">
            {loading ? (
               <p className="text-muted text-center py-10">Loading schedule...</p>
            ) : filteredBookings.length > 0 ? (
              <div className="bookings-grid">
                {filteredBookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    
                    {/* Left: Date Ticket Stub */}
                    <div className="card-stub">
                      <span className="stub-month">{booking.month}</span>
                      <span className="stub-day">{booking.day}</span>
                      <span className="stub-year">{booking.date.split(',')[1]}</span>
                    </div>

                    {/* Right: Details */}
                    <div className="card-body">
                      
                      {/* Header: ID & Status */}
                      <div className="card-top-row">
                        <span className="booking-id">{booking.id}</span>
                        <div className={`status-badge status-${booking.status}`}>
                           {getStatusIcon(booking.status)}
                           {booking.status}
                        </div>
                      </div>

                      {/* Main Info */}
                      <h3 className="event-title">{booking.category}</h3>
                      
                      <div className="photographer-row">
                        <div className="pg-avatar-sm">{booking.avatar}</div>
                        <div className="pg-details">
                            <span className="pg-name">{booking.photographer}</span>
                            <span className="pg-label">Photographer</span>
                        </div>
                      </div>

                      {/* Meta Details */}
                      <div className="meta-grid">
                        <div className="meta-item">
                            <Clock size={14} className="meta-icon" />
                            <span>{booking.time} ({booking.duration})</span>
                        </div>
                        <div className="meta-item">
                            <MapPin size={14} className="meta-icon" />
                            <span>{booking.location}</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="card-footer">
                        <span className="price-tag">{booking.price}</span>
                        
                        <div className="action-buttons">
                            {booking.status === 'completed' ? (
                                <button className="btn-action-outline">
                                    <Star size={14} /> Rate
                                </button>
                            ) : (
                                <button className="btn-action-outline">
                                    <MessageSquare size={14} /> Chat
                                </button>
                            )}
                            
                            <button className="btn-action-primary">View Details</button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* --- EMPTY STATE --- */
              <div className="empty-booking-state">
                <div className="empty-icon-circle">
                    <Calendar size={48} />
                </div>
                <h3>No {activeTab} bookings found</h3>
                <p>Looks like you don't have any sessions in this category.</p>
                {activeTab === 'upcoming' && (
                    <button className="btn-explore-link" onClick={() => navigate('/explore')}>Find a Photographer</button>
                )}
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