// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  // Standard Icons
  Camera, Calendar, Users, DollarSign, Image as ImageIcon, Upload, X, Clock, MapPin, ArrowRight, Search, Heart, Star,
  // Widget Icons
  MoreVertical, MessageSquare, CheckCircle, AlertCircle, Sparkles
} from "lucide-react";

// --- SHARED UTILITIES ---
const useToast = () => ({ toast: ({ title, description, variant }) => console.log(`[TOAST] ${title}: ${description}`) });

// --- SHARED COMPONENTS ---
const StatCard = ({ title, icon: Icon, value, footerText, valuePrefix = '', onClick }) => (
    <div className={`stat-card ${onClick ? 'interactive' : ''}`} onClick={onClick}>
        <div className="stat-header">
            <h4 className="stat-title">{title}</h4>
            {Icon && <Icon className="stat-icon" />}
        </div>
        <div className="stat-value">{valuePrefix}<span className="stat-value-large">{value}</span></div>
        <p className="stat-footer">{footerText}</p>
    </div>
);

const ActionButton = ({ icon: Icon, label, isPrimary = false, onClick }) => (
    <button className={isPrimary ? 'action-button-primary' : 'action-button-secondary'} onClick={onClick}>
        <Icon className="action-icon" /><span>{label}</span>
    </button>
);

// ==========================================
// 📸 PHOTOGRAPHER DASHBOARD
// ==========================================
const PhotographerDashboard = ({ profile, navigate, showFollowers, setShowFollowers, showBookings, setShowBookings }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    
    // Mock Data
    const totalPhotos = 0; 
    const upcomingBookingsCount = 3; 
    const followersCount = 4; 
    const totalRevenue = 0;

    const mockFollowers = [
        { id: 1, name: "Sarah Jenkins", role: "Wedding Photographer", initials: "SJ" },
        { id: 2, name: "Mike Chen", role: "Studio Owner", initials: "MC" },
        { id: 3, name: "Pixel Studio", role: "Creative Agency", initials: "PS" },
        { id: 4, name: "David Rose", role: "Model", initials: "DR" },
    ];

    const mockBookings = [
        { id: 1, title: "Wedding - Alice & Bob", day: "24", month: "OCT", time: "10:00 AM", location: "Grand Hyatt", status: "confirmed" },
        { id: 2, title: "Product Shoot - Nike", day: "02", month: "NOV", time: "02:00 PM", location: "Studio 54", status: "pending" },
        { id: 3, title: "Portrait Session", day: "15", month: "NOV", time: "09:00 AM", location: "Marine Drive", status: "confirmed" },
    ];

    return (
        <>
            <div className="stats-container-fixed">
                <StatCard title="Total Photos" icon={ImageIcon} value={totalPhotos} footerText="In your portfolio" />
                <StatCard title="Upcoming Bookings" icon={Calendar} value={upcomingBookingsCount} footerText="Click to view schedule" onClick={() => setShowBookings(true)} />
                <StatCard title="Followers" icon={Users} value={followersCount} footerText="Click to view details" onClick={() => setShowFollowers(true)}/>
                <StatCard title="Total Revenue" icon={DollarSign} value={totalRevenue.toFixed(2)} valuePrefix="$" footerText="From completed bookings"/>
            </div>

            <div className="tabs-container">
                <div className="tab-buttons">
                    {['Overview', 'Bookings', 'Recent Photos'].map((tab) => (
                        <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                </div>
            </div>

            <div className="content-section">
                <h3 className="section-title">Quick Actions</h3>
                <p className="text-muted section-subtitle">Manage your photography business</p>
                <div className="actions-grid">
                    <ActionButton icon={Upload} label="Upload Photos" isPrimary={true} onClick={() => navigate("/upload-portfolio")} />
                    <ActionButton icon={Calendar} label="Manage Bookings" onClick={() => navigate("/manage-bookings")} />
                    <ActionButton icon={Camera} label="Edit Profile" onClick={() => navigate("/edit-profile")} />
                </div>
            </div>

            <div className="content-section">
                <h3 className="section-title">Recent Activity</h3>
                <p className="text-muted section-subtitle">Your latest bookings and uploads</p>
                <div className="activity-card"><p className="activity-placeholder">No bookings yet</p></div>
            </div>

            {/* MODAL 1: FOLLOWERS */}
            {showFollowers && (
                <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Your Community</h2>
                            <button className="close-btn" onClick={() => setShowFollowers(false)}><X size={24} /></button>
                        </div>
                        <div className="follower-list">
                            {mockFollowers.map(follower => (
                                <div key={follower.id} className="follower-item">
                                    <div className="follower-left">
                                        <div className="follower-avatar">{follower.initials}</div>
                                        <div className="follower-info">
                                            <h4>{follower.name}</h4>
                                            <p>{follower.role}</p>
                                        </div>
                                    </div>
                                    <button className="btn-view-profile" onClick={() => navigate(`/profile/${follower.id}`)}>View Profile</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: BOOKINGS */}
            {showBookings && (
                <div className="modal-overlay" onClick={() => setShowBookings(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Upcoming Schedule</h2>
                            <button className="close-btn" onClick={() => setShowBookings(false)}><X size={24} /></button>
                        </div>
                        <div className="booking-list">
                            {mockBookings.map((booking) => (
                                <div key={booking.id} className="booking-item">
                                    <div className="booking-left">
                                        <div className="date-box">
                                            <span className="date-day">{booking.day}</span>
                                            <span className="date-month">{booking.month}</span>
                                        </div>
                                        <div className="booking-info">
                                            <h4>{booking.title}</h4>
                                            <p><Clock size={12} /> {booking.time} <span className="mx-1">•</span> <MapPin size={12} /> {booking.location}</p>
                                        </div>
                                    </div>
                                    <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-view-all" onClick={() => navigate('/manage-bookings')}>
                            View Full Calendar <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};


// ==========================================
// 🌟 CLIENT DASHBOARD (WIDGET STYLE)
// ==========================================
const ClientDashboard = ({ profile, navigate }) => {
    // Mock Data
    const nextBooking = {
        id: "BK-201", photographer: "Elena Fisher", date: "Tomorrow, 10:00 AM", 
        location: "Grand Hyatt, Kochi", avatar: "EF", status: "confirmed"
    };

    const notifications = [
        { id: 1, text: "Elena accepted your request", time: "2h ago", icon: <CheckCircle size={14} className="text-green-400"/> },
        { id: 2, text: "New 'Wedding' collection available", time: "5h ago", icon: <Sparkles size={14} className="text-yellow-400"/> },
        { id: 3, text: "Complete your profile", time: "1d ago", icon: <AlertCircle size={14} className="text-blue-400"/> },
    ];

    const spotlightPhotographer = {
        id: 104, name: "Sarah Jenkins", category: "Fashion & Editorial", 
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500&h=300",
        rating: 4.9
    };

    return (
        <div className="client-dashboard-wrapper">
            
            {/* 1. HERO WIDGET SECTION */}
            <div className="dashboard-hero-row">
                {/* Welcome Widget */}
                <div className="hero-widget welcome-widget">
                    <div className="widget-content">
                        <h2>Ready for your close-up?</h2>
                        <p>You have <strong>1 upcoming shoot</strong> and <strong>3 unread messages</strong>.</p>
                        <div className="hero-search-pill">
                            <Search size={18} className="text-muted"/>
                            <input type="text" placeholder="Find a photographer..." />
                        </div>
                    </div>
                    <div className="hero-decoration">
                        <Camera size={120} strokeWidth={1} className="deco-icon" />
                    </div>
                </div>

                {/* Quick Stats Widget */}
                <div className="hero-widget stats-widget-vertical">
                    <div className="mini-stat-row" onClick={() => navigate('/saved')}>
                        <div className="icon-box pink"><Heart size={20} /></div>
                        <div>
                            <span className="stat-num">12</span>
                            <span className="stat-label">Favorites</span>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="mini-stat-row" onClick={() => navigate('/my-bookings')}>
                        <div className="icon-box purple"><Calendar size={20} /></div>
                        <div>
                            <span className="stat-num">02</span>
                            <span className="stat-label">Bookings</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="dashboard-widgets-grid">
                
                {/* LEFT COLUMN: STATUS & ALERTS */}
                <div className="widget-column left">
                    
                    {/* "Up Next" Widget */}
                    <div className="dashboard-card next-up-card">
                        <div className="card-header-row">
                            <h3>Up Next</h3>
                            <button className="btn-icon-only"><MoreVertical size={16}/></button>
                        </div>
                        <div className="next-booking-display">
                            <div className="nb-date-circle">
                                <span className="nb-day">24</span>
                                <span className="nb-month">OCT</span>
                            </div>
                            <div className="nb-info">
                                <h4>{nextBooking.photographer}</h4>
                                <p className="nb-time"><Clock size={12}/> {nextBooking.date}</p>
                                <p className="nb-loc"><MapPin size={12}/> {nextBooking.location}</p>
                            </div>
                        </div>
                        <div className="nb-actions">
                            <button className="btn-glass" onClick={() => navigate('/my-bookings')}>View Ticket</button>
                            <button className="btn-glass-icon"><MessageSquare size={16}/></button>
                        </div>
                    </div>

                    {/* Notification Feed Widget */}
                    <div className="dashboard-card feed-card">
                        <h3>Activity Feed</h3>
                        <div className="feed-list">
                            {notifications.map(notif => (
                                <div key={notif.id} className="feed-item">
                                    <div className="feed-icon">{notif.icon}</div>
                                    <div className="feed-text">
                                        <p>{notif.text}</p>
                                        <span>{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: INSPIRATION & DISCOVERY */}
                <div className="widget-column right">
                    
                    {/* "Spotlight" Widget */}
                    <div className="dashboard-card spotlight-card" onClick={() => navigate(`/profile/${spotlightPhotographer.id}`)}>
                        <div className="spotlight-image">
                            <img src={spotlightPhotographer.image} alt={spotlightPhotographer.name} />
                            <div className="spotlight-badge">Trending</div>
                        </div>
                        <div className="spotlight-content">
                            <div className="spotlight-info">
                                <h4>{spotlightPhotographer.name}</h4>
                                <p>{spotlightPhotographer.category}</p>
                            </div>
                            <div className="spotlight-rating">
                                <Star size={14} fill="white" color="white" /> {spotlightPhotographer.rating}
                            </div>
                        </div>
                    </div>

                    {/* Quick Categories Widget */}
                    <div className="dashboard-card categories-widget">
                        <h3>Browse</h3>
                        <div className="cat-grid-mini">
                            {['Wedding', 'Portrait', 'Fashion', 'Product'].map(cat => (
                                <button key={cat} className="cat-box" onClick={() => navigate('/explore')}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


// ==========================================
// 🚀 MAIN DASHBOARD CONTAINER
// ==========================================
const Dashboard = () => {
  const navigate = useNavigate(); 
  const { toast } = useToast(); 
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // State for Photographer Modals
  const [showFollowers, setShowFollowers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole') || 'client'; 
    
    setProfile({ 
        full_name: storedName || "User",
        role: storedRole.toLowerCase() 
    });
    setLoading(false);
  }, []);

  if (loading) return <div className="page-container center-content"><Navbar /><p className="text-muted">Loading...</p></div>;

  const welcomeName = profile?.full_name || "Guest"; 
  const welcomeEmailInitial = welcomeName.charAt(0).toUpperCase();
  const isPhotographer = profile?.role === 'photographer';

  return (
    <div className="page-container">
      <Navbar /> 
      
      <main className="dashboard-main-content">
        <div className="content-wrapper">
          
          {/* SHARED WELCOME SECTION (Enabled for BOTH, customized text) */}
          <div className="welcome-section">
            <div className="welcome-inner">
              <div className="avatar-badge">{welcomeEmailInitial}</div>
              <div>
                <h1 className="welcome-title">Welcome back, <span className="text-purple">{welcomeName}!</span></h1>
                <p className="text-muted">
                    {isPhotographer 
                        ? "Here's what's happening with your photography business"
                        : "Explore top-rated photographers and manage your bookings."}
                </p>
              </div>
            </div>
          </div>

          {/* CONDITIONAL RENDERING BASED ON ROLE */}
          {isPhotographer ? (
              <PhotographerDashboard 
                  profile={profile} 
                  navigate={navigate}
                  showFollowers={showFollowers}
                  setShowFollowers={setShowFollowers}
                  showBookings={showBookings}
                  setShowBookings={setShowBookings}
              />
          ) : (
              <ClientDashboard 
                  profile={profile} 
                  navigate={navigate}
              />
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;