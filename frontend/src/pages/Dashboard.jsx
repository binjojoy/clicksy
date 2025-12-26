import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Camera, Calendar, Users, DollarSign, Image as ImageIcon, Upload, X 
} from "lucide-react";

// =========================================================================
// 1. UPDATED STAT CARD (Now supports onClick and interactivity)
// =========================================================================
const StatCard = ({ title, icon: Icon, value, footerText, valuePrefix = '', onClick }) => (
    <div 
        className={`stat-card ${onClick ? 'interactive' : ''}`} // Adds hover effect if clickable
        onClick={onClick}
    >
        <div className="stat-header">
            <h4 className="stat-title">{title}</h4>
            {Icon && <Icon className="stat-icon" />}
        </div>
        
        <div className="stat-value">
            {valuePrefix}<span className="stat-value-large">{value}</span>
        </div>
        
        <p className="stat-footer">{footerText}</p>
    </div>
);

const ActionButton = ({ icon: Icon, label, isPrimary = false, onClick }) => (
    <button 
        className={isPrimary ? 'action-button-primary' : 'action-button-secondary'}
        onClick={onClick}
    >
        <Icon className="action-icon" />
        <span>{label}</span>
    </button>
);

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); 
  
  // 2. NEW STATE FOR MODAL
  const [showFollowers, setShowFollowers] = useState(false);

  // 3. STATIC MOCK DATA FOR FOLLOWERS
  const mockFollowers = [
      { id: 1, name: "Alice Lens", role: "Photographer", initials: "AL" },
      { id: 2, name: "Studio 54", role: "Studio Owner", initials: "S5" },
      { id: 3, name: "Mark Snaps", role: "Enthusiast", initials: "MS" },
      { id: 4, name: "Sarah J.", role: "Model", initials: "SJ" },
  ];

  // Existing Mock values
  const upcomingBookings = 0;
  const totalRevenue = 0;
  const totalPhotos = 0; 
  const followersCount = mockFollowers.length; // Use length of mock data

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    setProfile({ 
      full_name: storedName || "Photographer", 
      total_photos: 0, 
      followers_count: 0 
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="page-container center-content">
        <Navbar />
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

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
              <div className="avatar-badge">
                {welcomeEmailInitial}
              </div>
              <div>
                <h1 className="welcome-title">
                  Welcome back, <span className="text-purple">{welcomeName}!</span>
                </h1>
                <p className="text-muted">
                  Here's what's happening with your photography business
                </p>
              </div>
            </div>
          </div>

          {/* 4. STATS CARDS - Added onClick to Followers Card */}
          <div className="stats-container-fixed">
            <StatCard 
                title="Total Photos" 
                icon={ImageIcon} 
                value={totalPhotos}
                footerText="In your portfolio"
            />
            <StatCard 
                title="Upcoming Bookings" 
                icon={Calendar} 
                value={upcomingBookings}
                footerText="Confirmed events"
            />
            
            {/* THIS CARD IS NOW CLICKABLE */}
            <StatCard 
                title="Followers" 
                icon={Users} 
                value={followersCount}
                footerText="Click to view details" 
                onClick={() => setShowFollowers(true)}
            />
            
            <StatCard 
                title="Total Revenue" 
                icon={DollarSign} 
                value={totalRevenue.toFixed(2)}
                valuePrefix="$"
                footerText="From completed bookings"
            />
          </div>

          {/* Main Content Tabs */}
          <div className="tabs-container">
            <div className="tab-buttons">
              {['Overview', 'Bookings', 'Recent Photos'].map((tab) => (
                <button 
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="content-section">
            <h3 className="section-title">Quick Actions</h3>
            <p className="text-muted section-subtitle">Manage your photography business</p>
            <div className="actions-grid">
              <ActionButton 
                icon={Upload} 
                label="Upload Photos"
                isPrimary={true}
                onClick={() => navigate("/upload-portfolio")}
              />
              <ActionButton 
                icon={Calendar} 
                label="Manage Bookings"
                onClick={() => navigate("/manage-bookings")}
              />
              <ActionButton 
                icon={Camera} 
                label="Edit Profile"
                onClick={() => navigate("/edit-profile")}
              />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="content-section">
            <h3 className="section-title">Recent Activity</h3>
            <p className="text-muted section-subtitle">Your latest bookings and uploads</p>
            <div className="activity-card">
              <p className="activity-placeholder">
                No bookings yet
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* 5. THE FOLLOWERS MODAL (Flash Card) */}
      {showFollowers && (
        <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Your Community</h2>
                    <button className="close-btn" onClick={() => setShowFollowers(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="follower-list">
                    {mockFollowers.map((user) => (
                        <div key={user.id} className="follower-item">
                            <div className="follower-info">
                                <div className="follower-avatar">{user.initials}</div>
                                <div className="follower-details">
                                    <h4>{user.name}</h4>
                                    <p>{user.role}</p>
                                </div>
                            </div>
                            <button className="btn-profile">View Profile</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;