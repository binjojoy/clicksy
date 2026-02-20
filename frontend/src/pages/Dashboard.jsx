import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js"; 
import { 
  // Standard Icons
  Camera, Calendar, Users, DollarSign, Image as ImageIcon, Upload, X, Clock, MapPin, ArrowRight, Search, Heart, Star,
  // Widget Icons
  MoreVertical, MessageSquare, CheckCircle, AlertCircle, Sparkles,
  // New Icons for Pro UI
  Loader2, ChevronRight, User
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
// 📸 PHOTOGRAPHER DASHBOARD (PRO UI INTEGRATED)
// ==========================================
const PhotographerDashboard = ({ profile, navigate, showFollowers, setShowFollowers, showBookings, setShowBookings }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    
    // --- REAL DATA STATE ---
    const [photoCount, setPhotoCount] = useState(0); 
    const [followerCount, setFollowerCount] = useState(0); 
    const [bookings, setBookings] = useState([]); 
    
    // Followers Modal State
    const [followersList, setFollowersList] = useState([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    
    // --- HELPER: Format Date ---
    const formatDate = (isoString) => {
        if (!isoString) return { day: '--', month: '---', time: '--:--' };
        const date = new Date(isoString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            time: date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })
        };
    };

    // --- 1. FETCH DASHBOARD STATS ---
    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;

            try {
                // Parallel fetch for speed
                const [statsRes, followRes, bookingRes] = await Promise.all([
                    api.get(`/user/stats/${userId}`).catch(() => ({ data: { photoCount: 0 } })),
                    api.get(`/profile/${userId}/follow-stats`).catch(() => ({ data: { followersCount: 0 } })),
                    api.get(`/bookings/user/${userId}`).catch(() => ({ data: [] }))
                ]);

                setPhotoCount(statsRes.data.photoCount);
                setFollowerCount(followRes.data.followersCount);

                const formattedBookings = bookingRes.data.map(b => {
                    const { day, month, time } = formatDate(b.start_time);
                    return {
                        id: b.id,
                        title: b.booking_title,
                        day, month, time,
                        location: b.special_requirements || "On Location", 
                        status: b.status
                    };
                });
                setBookings(formattedBookings);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    // --- 2. FETCH FOLLOWERS LIST (On Open) ---
    useEffect(() => {
        if (showFollowers) {
            const fetchFollowersList = async () => {
                setLoadingFollowers(true);
                const userId = localStorage.getItem('user_id');
                try {
                    const { data } = await api.get(`/profile/${userId}/followers`);
                    // Ensure we always work with an array
                    setFollowersList(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Failed to load followers", error);
                    setFollowersList([]); 
                } finally {
                    setLoadingFollowers(false);
                }
            };
            fetchFollowersList();
        }
    }, [showFollowers]);

    const totalRevenue = 0;

    return (
        <>
            <div className="stats-container-fixed">
                <StatCard title="Total Photos" icon={ImageIcon} value={photoCount} footerText="In your portfolio" />
                
                <StatCard 
                    title="Upcoming Bookings" 
                    icon={Calendar} 
                    value={bookings.length} 
                    footerText="Click to view schedule" 
                    onClick={() => setShowBookings(true)} 
                />
                
                {/* Clickable Follower Card */}
                <StatCard 
                    title="Followers" 
                    icon={Users} 
                    value={followerCount} 
                    footerText="Your community" 
                    onClick={() => setShowFollowers(true)}
                />
                
                <StatCard title="Total Revenue" icon={DollarSign} value={totalRevenue.toFixed(2)} valuePrefix="₹" footerText="From completed bookings"/>
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
                
                {bookings.length > 0 ? (
                    <div className="activity-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <h4 style={{color: 'white', marginBottom: '4px'}}>New Booking: {bookings[0].title}</h4>
                            <p className="text-muted" style={{fontSize: '0.9rem'}}>
                                {bookings[0].day} {bookings[0].month} at {bookings[0].time}
                            </p>
                        </div>
                        <span className={`status-badge status-${bookings[0].status}`}>{bookings[0].status}</span>
                    </div>
                ) : (
                    <div className="activity-card"><p className="activity-placeholder">No upcoming bookings</p></div>
                )}
            </div>

            {/* === MODAL 1: FOLLOWERS (NEW CLASSIC UI) === */}
            {showFollowers && (
                <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Your Community</h2>
                                <p className="text-muted text-sm" style={{marginTop:'4px'}}>
                                    {followersList.length} people following you
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setShowFollowers(false)}><X size={24} /></button>
                        </div>
                        
                        <div className="follower-list-container">
                            {loadingFollowers ? (
                                <div className="state-message">
                                    <Loader2 className="animate-spin" /> Loading...
                                </div>
                            ) : followersList.length === 0 ? (
                                <div className="state-message">
                                    <Users size={32} style={{opacity:0.5, marginBottom:10}}/>
                                    No followers yet.
                                </div>
                            ) : (
                                <div className="follower-grid">
                                    {followersList.map(follower => (
                                        <div 
                                            key={follower.id} 
                                            className="follower-card-classic" 
                                            onClick={() => navigate(`/profile/${follower.id}`)}
                                        >
                                            <div className="fc-left">
                                                {follower.avatar ? (
                                                    <img src={follower.avatar} alt={follower.name} className="fc-avatar" />
                                                ) : (
                                                    <div className="fc-avatar-placeholder">
                                                        {follower.name ? follower.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                                <div className="fc-info">
                                                    <h4>{follower.name}</h4>
                                                    <p>{follower.role || "Member"}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="fc-action">
                                                <span className="view-text">View</span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* === MODAL 2: BOOKINGS (Standard UI) === */}
            {showBookings && (
                <div className="modal-overlay" onClick={() => setShowBookings(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Upcoming Schedule</h2>
                            <button className="close-btn" onClick={() => setShowBookings(false)}><X size={24} /></button>
                        </div>
                        
                        <div className="booking-list">
                            {bookings.length === 0 ? (
                                <p className="text-muted text-center py-4">No upcoming bookings found.</p>
                            ) : (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="booking-item">
                                        <div className="booking-left">
                                            <div className="date-box">
                                                <span className="date-day">{booking.day}</span>
                                                <span className="date-month">{booking.month}</span>
                                            </div>
                                            <div className="booking-info">
                                                <h4>{booking.title}</h4>
                                                <p>
                                                    <Clock size={12} /> {booking.time} <span className="mx-1">•</span> <MapPin size={12} /> {booking.location}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                                    </div>
                                ))
                            )}
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
// 🌟 CLIENT DASHBOARD (Unchanged)
// ==========================================
const ClientDashboard = ({ profile, navigate }) => {
    // Mock Data for Client view
    const nextBooking = { id: "BK-201", photographer: "Elena Fisher", date: "Tomorrow, 10:00 AM", location: "Grand Hyatt, Kochi", avatar: "EF", status: "confirmed" };
    const notifications = [
        { id: 1, text: "Elena accepted your request", time: "2h ago", icon: <CheckCircle size={14} className="text-green-400"/> },
        { id: 2, text: "New 'Wedding' collection available", time: "5h ago", icon: <Sparkles size={14} className="text-yellow-400"/> },
        { id: 3, text: "Complete your profile", time: "1d ago", icon: <AlertCircle size={14} className="text-blue-400"/> },
    ];
    const spotlightPhotographer = { id: 104, name: "Sarah Jenkins", category: "Fashion & Editorial", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500&h=300", rating: 4.9 };

    return (
        <div className="client-dashboard-wrapper">
            <div className="dashboard-hero-row">
                <div className="hero-widget welcome-widget">
                    <div className="widget-content">
                        <h2>Ready for your close-up?</h2>
                        <p>You have <strong>1 upcoming shoot</strong> and <strong>3 unread messages</strong>.</p>
                        <div className="hero-search-pill">
                            <Search size={18} className="text-muted"/>
                            <input type="text" placeholder="Find a photographer..." />
                        </div>
                    </div>
                    <div className="hero-decoration"><Camera size={120} strokeWidth={1} className="deco-icon" /></div>
                </div>
                <div className="hero-widget stats-widget-vertical">
                    <div className="mini-stat-row" onClick={() => navigate('/saved')}>
                        <div className="icon-box pink"><Heart size={20} /></div>
                        <div><span className="stat-num">12</span><span className="stat-label">Favorites</span></div>
                    </div>
                    <div className="divider"></div>
                    <div className="mini-stat-row" onClick={() => navigate('/my-bookings')}>
                        <div className="icon-box purple"><Calendar size={20} /></div>
                        <div><span className="stat-num">02</span><span className="stat-label">Bookings</span></div>
                    </div>
                </div>
            </div>

            <div className="dashboard-widgets-grid">
                <div className="widget-column left">
                    <div className="dashboard-card next-up-card">
                        <div className="card-header-row">
                            <h3>Up Next</h3>
                            <button className="btn-icon-only"><MoreVertical size={16}/></button>
                        </div>
                        <div className="next-booking-display">
                            <div className="nb-date-circle"><span className="nb-day">24</span><span className="nb-month">OCT</span></div>
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
                    <div className="dashboard-card feed-card">
                        <h3>Activity Feed</h3>
                        <div className="feed-list">
                            {notifications.map(notif => (
                                <div key={notif.id} className="feed-item">
                                    <div className="feed-icon">{notif.icon}</div>
                                    <div className="feed-text"><p>{notif.text}</p><span>{notif.time}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="widget-column right">
                    <div className="dashboard-card spotlight-card" onClick={() => navigate(`/profile/${spotlightPhotographer.id}`)}>
                        <div className="spotlight-image">
                            <img src={spotlightPhotographer.image} alt={spotlightPhotographer.name} />
                            <div className="spotlight-badge">Trending</div>
                        </div>
                        <div className="spotlight-content">
                            <div className="spotlight-info"><h4>{spotlightPhotographer.name}</h4><p>{spotlightPhotographer.category}</p></div>
                            <div className="spotlight-rating"><Star size={14} fill="white" color="white" /> {spotlightPhotographer.rating}</div>
                        </div>
                    </div>
                    <div className="dashboard-card categories-widget">
                        <h3>Browse</h3>
                        <div className="cat-grid-mini">
                            {['Wedding', 'Portrait', 'Fashion', 'Product'].map(cat => (
                                <button key={cat} className="cat-box" onClick={() => navigate('/explore')}>{cat}</button>
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
          
          <div className="welcome-section">
            <div className="welcome-inner">
              {/* Feature: Redirect on Avatar Click */}
              <div 
                className="avatar-badge" 
                onClick={() => navigate('/profiles')} 
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                title="View your public profile"
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {welcomeEmailInitial}
              </div>
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
              <ClientDashboard profile={profile} navigate={navigate} />
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;