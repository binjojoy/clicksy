// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Camera, Calendar, Users, DollarSign, Image as ImageIcon, Upload, X, Clock, MapPin, ArrowRight, Search, Heart, Star 
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
// 📸 PHOTOGRAPHER DASHBOARD (Your Original Code)
// ==========================================
const PhotographerDashboard = ({ profile, navigate, showFollowers, setShowFollowers, showBookings, setShowBookings }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    
    // Mock Data
    const totalPhotos = 0; 
    const upcomingBookingsCount = 3; // Mock
    const followersCount = 4; // Mock
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
// 👤 CLIENT DASHBOARD (New Simplified UI)
// ==========================================
// src/pages/Dashboard.jsx (Replace ONLY the ClientDashboard component)

// ... (Keep shared components like StatCard, ActionButton above this)

// ==========================================
// 👤 CLIENT DASHBOARD (UPGRADED UI)
// ==========================================
const ClientDashboard = ({ profile, navigate }) => {
    // Mock Data for Client
    const activeBooking = {
        id: 201, photographer: "Elena Fisher", category: "Wedding Shoot", 
        date: "Oct 24, 2025", time: "10:00 AM", location: "Grand Hyatt, Kochi",
        status: "confirmed", avatar: "EF"
    };

    const categories = ["Wedding", "Fashion", "Portrait", "Product", "Events", "Food"];

    const featuredPhotographers = [
        { id: 101, name: "Elena Fisher", category: "Wedding", rating: 4.9, price: "$200/hr", location: "Kochi", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400" },
        { id: 102, name: "Arjun Kapoor", category: "Portrait", rating: 4.8, price: "$150/hr", location: "Bangalore", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400" },
        { id: 103, name: "LensCrafters", category: "Product", rating: 5.0, price: "$300/project", location: "Mumbai", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400" },
        { id: 104, name: "Sarah Jenkins", category: "Fashion", rating: 4.7, price: "$180/hr", location: "Delhi", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400" },
    ];

    return (
        <>
            {/* 1. HERO SEARCH SECTION */}
            <div className="client-header-section">
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input type="text" placeholder="Search for photographers, styles, or locations..." className="search-input" />
                </div>
                <div className="category-pills">
                    {categories.map(cat => (
                        <button key={cat} className="cat-pill" onClick={() => navigate('/explore')}>{cat}</button>
                    ))}
                </div>
            </div>

            <div className="dashboard-grid-layout">
                {/* LEFT COLUMN: UPCOMING & STATS */}
                <div className="left-column">
                    
                    {/* Active Booking Card */}
                    <div className="section-header">
                        <h3 className="section-title-sm">Your Next Shoot</h3>
                        <button className="btn-link-sm" onClick={() => navigate('/my-bookings')}>View All</button>
                    </div>
                    
                    <div className="active-booking-card">
                        <div className="booking-status-strip confirmed"></div>
                        <div className="abc-content">
                            <div className="abc-header">
                                <div className="abc-photographer">
                                    <div className="abc-avatar">{activeBooking.avatar}</div>
                                    <div>
                                        <h4>{activeBooking.photographer}</h4>
                                        <p>{activeBooking.category}</p>
                                    </div>
                                </div>
                                <span className="status-pill confirmed">Confirmed</span>
                            </div>
                            <div className="abc-details">
                                <div className="detail-item"><Calendar size={14}/> {activeBooking.date}</div>
                                <div className="detail-item"><Clock size={14}/> {activeBooking.time}</div>
                                <div className="detail-item"><MapPin size={14}/> {activeBooking.location}</div>
                            </div>
                            <button className="btn-manage-booking" onClick={() => navigate('/my-bookings')}>Manage Booking</button>
                        </div>
                    </div>

                    {/* Mini Stats Grid */}
                    <div className="mini-stats-grid">
                        <div className="mini-stat" onClick={() => navigate('/saved')}>
                            <Heart size={20} className="text-pink" />
                            <div>
                                <span className="ms-value">12</span>
                                <span className="ms-label">Saved</span>
                            </div>
                        </div>
                        <div className="mini-stat">
                            <Clock size={20} className="text-blue" />
                            <div>
                                <span className="ms-value">2</span>
                                <span className="ms-label">Past</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DISCOVERY */}
                <div className="right-column">
                    <div className="section-header">
                        <h3 className="section-title-sm">Top Rated Photographers</h3>
                        <button className="btn-link-sm" onClick={() => navigate('/explore')}>See All</button>
                    </div>

                    <div className="photographer-grid-compact">
                        {featuredPhotographers.map(pg => (
                            <div key={pg.id} className="pg-card-compact" onClick={() => navigate(`/profile/${pg.id}`)}>
                                <div className="pg-img-wrapper">
                                    <img src={pg.image} alt={pg.name} />
                                    <button className="btn-save-icon"><Heart size={14} /></button>
                                </div>
                                <div className="pg-content">
                                    <div className="pg-row">
                                        <h4>{pg.name}</h4>
                                        <span className="pg-rating"><Star size={10} fill="#eab308" color="#eab308"/> {pg.rating}</span>
                                    </div>
                                    <p className="pg-cat">{pg.category} • {pg.location}</p>
                                    <div className="pg-footer">
                                        <span className="pg-price">{pg.price}</span>
                                        <button className="btn-view-mini">View</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Promo / Call to Action */}
                    <div className="promo-banner" onClick={() => navigate('/explore')}>
                        <div className="promo-text">
                            <h4>Not sure what you need?</h4>
                            <p>Browse our curated collections for inspiration.</p>
                        </div>
                        <ArrowRight className="promo-icon" />
                    </div>
                </div>
            </div>
        </>
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
    const storedRole = localStorage.getItem('userRole') || 'client'; // Default to client if missing
    
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
          
          {/* Shared Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-inner">
              <div className="avatar-badge">{welcomeEmailInitial}</div>
              <div>
                <h1 className="welcome-title">Welcome back, <span className="text-purple">{welcomeName}!</span></h1>
                <p className="text-muted">
                    {isPhotographer 
                        ? "Here's what's happening with your photography business"
                        : "Ready to capture your next memory?"}
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