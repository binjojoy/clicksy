import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Camera, Calendar, Users, DollarSign, Image as ImageIcon, Upload, X, Clock, MapPin, ArrowRight 
} from "lucide-react";

// --- (Keep StatCard, ActionButton, useToast EXACTLY as they were) ---
const useToast = () => ({ toast: ({ title, description, variant }) => console.log(`[TOAST] ${title}: ${description}`) });
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

const Dashboard = () => {
  const navigate = useNavigate(); 
  const { toast } = useToast(); 
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); 

  // --- MODAL STATES ---
  const [showFollowers, setShowFollowers] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  // --- MOCK DATA ---
  const mockBookings = [
      { id: 1, title: "Wedding - Alice & Bob", day: "24", month: "OCT", time: "10:00 AM", location: "Grand Hyatt", status: "confirmed" },
      { id: 2, title: "Product Shoot - Nike", day: "02", month: "NOV", time: "02:00 PM", location: "Studio 54", status: "pending" },
      { id: 3, title: "Portrait Session", day: "15", month: "NOV", time: "09:00 AM", location: "Marine Drive", status: "confirmed" },
  ];

  // NEW: Mock Followers Data
  const mockFollowers = [
      { id: 1, name: "Sarah Jenkins", role: "Wedding Photographer", initials: "SJ" },
      { id: 2, name: "Mike Chen", role: "Studio Owner", initials: "MC" },
      { id: 3, name: "Pixel Studio", role: "Creative Agency", initials: "PS" },
      { id: 4, name: "David Rose", role: "Model", initials: "DR" },
  ];

  const upcomingBookings = mockBookings.length;
  const followersCount = mockFollowers.length; // Use real length now
  const totalRevenue = 0;
  const totalPhotos = 0; 

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    setProfile({ full_name: storedName || "Photographer" });
    setLoading(false);
  }, []);

  if (loading) return <div className="page-container center-content"><Navbar /><p className="text-muted">Loading...</p></div>;

  const welcomeName = profile?.full_name || "titan ax"; 
  const welcomeEmailInitial = welcomeName.charAt(0).toUpperCase();

  return (
    <div className="page-container">
      <Navbar /> 
      
      <main className="dashboard-main-content">
        <div className="content-wrapper">
          
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-inner">
              <div className="avatar-badge">{welcomeEmailInitial}</div>
              <div>
                <h1 className="welcome-title">Welcome back, <span className="text-purple">{welcomeName}!</span></h1>
                <p className="text-muted">Here's what's happening with your photography business</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-container-fixed">
            <StatCard title="Total Photos" icon={ImageIcon} value={totalPhotos} footerText="In your portfolio" />
            <StatCard title="Upcoming Bookings" icon={Calendar} value={upcomingBookings} footerText="Click to view schedule" onClick={() => setShowBookings(true)} />
            
            {/* Followers Card (Clickable) */}
            <StatCard title="Followers" icon={Users} value={followersCount} footerText="Click to view details" onClick={() => setShowFollowers(true)}/>
            
            <StatCard title="Total Revenue" icon={DollarSign} value={totalRevenue.toFixed(2)} valuePrefix="$" footerText="From completed bookings"/>
          </div>

          {/* (Tabs, Actions, Activity - Kept Unchanged) */}
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
              <ActionButton icon={Camera} label="Edit Profile" onClick={() => navigate("/profile")} />
            </div>
          </div>
          <div className="content-section">
            <h3 className="section-title">Recent Activity</h3>
            <p className="text-muted section-subtitle">Your latest bookings and uploads</p>
            <div className="activity-card"><p className="activity-placeholder">No bookings yet</p></div>
          </div>

        </div>
      </main>

      {/* --- MODAL 1: FOLLOWERS (UPDATED) --- */}
      {showFollowers && (
        <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Your Community</h2>
                    <button className="close-btn" onClick={() => setShowFollowers(false)}><X size={24} /></button>
                </div>
                
                <div className="follower-list">
                    {mockFollowers.length === 0 ? (
                        <p className="empty-state">You don't have any followers yet.</p>
                    ) : (
                        mockFollowers.map(follower => (
                            <div key={follower.id} className="follower-item">
                                <div className="follower-left">
                                    <div className="follower-avatar">{follower.initials}</div>
                                    <div className="follower-info">
                                        <h4>{follower.name}</h4>
                                        <p>{follower.role}</p>
                                    </div>
                                </div>
                                <button className="btn-view-profile" onClick={() => navigate(`/profile/${follower.id}`)}>
                                    View Profile
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL 2: BOOKINGS (Existing) --- */}
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

      <Footer />
    </div>
  );
};

export default Dashboard;