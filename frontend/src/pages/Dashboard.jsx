// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; 
import './Dashboard.css'; // This file is now doing all the styling work

// 🔑 ONLY IMPORTS THAT ARE LIKELY STABLE
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { 
  Camera, 
  Calendar, 
  Users, 
  DollarSign,
  Image as ImageIcon,
  Upload
} from "lucide-react";


// =========================================================================
// MOCK IMPLEMENTATIONS 
// =========================================================================

const useToast = () => ({
    toast: ({ title, description, variant }) => console.log(`[TOAST] [${variant || 'info'}] ${title}: ${description}`)
});

// Utility Component: StatCard (Using only the custom CSS class)
const StatCard = ({ title, icon: Icon, value, footerText, valuePrefix = '' }) => (
    <div className="stat-card">
        
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

// Utility Component: ActionButton (Using only the custom CSS class)
const ActionButton = ({ icon: Icon, label, isPrimary = false, onClick }) => (
    <button 
        className={isPrimary ? 'action-button-primary' : 'action-button-secondary'}
        onClick={onClick}
    >
        <Icon className="action-icon" />
        <span>{label}</span>
    </button>
);
// =========================================================================
// =========================================================================


const API_BASE_URL = 'http://localhost:5000/api/v1/user'; 

const Dashboard = () => {
  const navigate = useNavigate(); 
  const { toast } = useToast(); 
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); 

  // Mock values
  const upcomingBookings = 0;
  const totalRevenue = 0;
  const totalPhotos = 0; 
  const followersCount = 0; 

  useEffect(() => {
    // Mocking data fetch for quick testing
    setProfile({ full_name: "titan ax", total_photos: 0, followers_count: 0 });
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

  // --- Main Render ---
  return (
    <div className="page-container">
      <Navbar /> 
      
      <main className="dashboard-main-content">
        <div className="content-wrapper">
          
          {/* 1. Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-inner">
              {/* Avatar/Initial Badge */}
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

          {/* 2. Stats Cards - FORCED 1x4 HORIZONTAL LAYOUT VIA CSS FLEXBOX */}
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
            <StatCard 
                title="Followers" 
                icon={Users} 
                value={followersCount}
                footerText="People following you"
            />
            <StatCard 
                title="Total Revenue" 
                icon={DollarSign} 
                value={totalRevenue.toFixed(2)}
                valuePrefix="$"
                footerText="From completed bookings"
            />
          </div>

          {/* 3. Main Content Tabs */}
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

          {/* 4. Quick Actions Card */}
          <div className="content-section">
            <h3 className="section-title">Quick Actions</h3>
            <p className="text-muted section-subtitle">Manage your photography business</p>
            <div className="actions-grid">
              <ActionButton 
                icon={Upload} 
                label="Upload Photos"
                isPrimary={true}
                onClick={() => console.log('Upload clicked')}
              />
              <ActionButton 
                icon={Calendar} 
                label="Manage Bookings"
                onClick={() => console.log('Manage Bookings clicked')}
              />
              <ActionButton 
                icon={Camera} 
                label="Edit Profile"
                onClick={() => console.log('Edit Profile clicked')}
              />
            </div>
          </div>
          
          {/* 5. Recent Activity */}
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

      <Footer />
    </div>
  );
};

export default Dashboard;