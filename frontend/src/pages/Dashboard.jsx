import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js";
import {
    // Standard Icons
    Camera, Calendar, Users, IndianRupee, Image as ImageIcon, Upload, X, Clock, MapPin, ArrowRight, Search, Heart, Star,
    // Widget Icons
    MoreVertical, MessageSquare, CheckCircle, AlertCircle, Sparkles, Bell,
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
    const [dashboardStats, setDashboardStats] = useState({ upcomingCount: 0, pendingCount: 0, totalRevenue: 0 });

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

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;

            try {
                const [statsRes, followRes, dashStatsRes] = await Promise.all([
                    api.get(`/user/stats/${userId}`).catch(() => ({ data: { photoCount: 0 } })),
                    api.get(`/profile/${userId}/follow-stats`).catch(() => ({ data: { followersCount: 0 } })),
                    api.get(`/bookings/photographer-dashboard/${userId}`).catch(() => ({ data: { upcomingCount: 0, pendingCount: 0, totalRevenue: 0, upcomingBookings: [] } }))
                ]);

                setPhotoCount(statsRes.data.photoCount);
                setFollowerCount(followRes.data.followersCount);

                const formattedBookings = (dashStatsRes.data.upcomingBookings || []).map(b => {
                    const { day, month, time } = formatDate(b.start_time);
                    return {
                        id: b.id,
                        title: b.booking_title || b.listing_title,
                        client_name: b.client_name,
                        day, month, time,
                        location: b.special_requirements || "On Location",
                        status: b.status,
                        total_price: b.total_price
                    };
                });
                setBookings(formattedBookings);
                setDashboardStats(dashStatsRes.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (showFollowers) {
            const fetchFollowersList = async () => {
                setLoadingFollowers(true);
                const userId = localStorage.getItem('user_id');
                try {
                    const { data } = await api.get(`/profile/${userId}/followers`);
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

    const totalRevenue = dashboardStats.totalRevenue || 0;

    return (
        <>
            <div className="stats-container-fixed">
                <StatCard title="Total Photos" icon={ImageIcon} value={photoCount} footerText="In your portfolio" />

                <StatCard
                    title="Upcoming Bookings"
                    icon={Calendar}
                    value={dashboardStats.upcomingCount}
                    footerText={`${dashboardStats.pendingCount} pending · Click to view`}
                    onClick={() => setShowBookings(true)}
                />

                <StatCard
                    title="Followers"
                    icon={Users}
                    value={followerCount}
                    footerText="Your community"
                    onClick={() => setShowFollowers(true)}
                />

                <StatCard title="Total Revenue" icon={IndianRupee} value={totalRevenue.toFixed(2)} valuePrefix="₹" footerText="From completed bookings" />
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
                    <div className="activity-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ color: 'white', marginBottom: '4px' }}>New Booking: {bookings[0].title}</h4>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                {bookings[0].day} {bookings[0].month} at {bookings[0].time}
                            </p>
                        </div>
                        <span className={`status-badge status-${bookings[0].status}`}>{bookings[0].status}</span>
                    </div>
                ) : (
                    <div className="activity-card"><p className="activity-placeholder">No upcoming bookings</p></div>
                )}
            </div>

            {showFollowers && (
                <div className="modal-overlay" onClick={() => setShowFollowers(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Your Community</h2>
                                <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
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
                                    <Users size={32} style={{ opacity: 0.5, marginBottom: 10 }} />
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

            {showBookings && (
                <div className="modal-overlay" onClick={() => setShowBookings(false)}>
                    <div className="modal-content bookings-modal-pro" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Upcoming Jobs</h2>
                                <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
                                    {bookings.length} confirmed booking{bookings.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setShowBookings(false)}><X size={24} /></button>
                        </div>

                        {/* Summary Stats Strip */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ flex: 1, background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a78bfa' }}>{bookings.length}</span>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>Active Jobs</span>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.15)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#eab308' }}>{dashboardStats.pendingCount}</span>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>Pending</span>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '0.5rem', padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>₹{bookings.reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}</span>
                                <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>Expected</span>
                            </div>
                        </div>

                        {/* Booking Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>
                            {bookings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                                    <Calendar size={36} style={{ opacity: 0.2, margin: '0 auto 0.75rem' }} />
                                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>No confirmed bookings yet</p>
                                    <p style={{ color: '#52525b', fontSize: '0.8rem' }}>Accepted bookings will appear here</p>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <div key={booking.id} style={{
                                        background: '#18181b', border: '1px solid #27272a', borderRadius: '0.75rem',
                                        padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        transition: 'all 0.2s', cursor: 'pointer'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.background = '#1f1f23'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.background = '#18181b'; }}
                                    >
                                        {/* Client Avatar */}
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: 700, fontSize: '0.85rem'
                                        }}>
                                            {booking.client_name ? booking.client_name.charAt(0).toUpperCase() : 'C'}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {booking.title}
                                            </h4>
                                            <p style={{ color: '#a1a1aa', fontSize: '0.78rem', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                {booking.client_name} <span style={{ opacity: 0.4 }}>•</span> {booking.day} {booking.month} <span style={{ opacity: 0.4 }}>•</span> {booking.time}
                                            </p>
                                        </div>

                                        {/* Price Tag */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                                                ₹{(booking.total_price || 0).toLocaleString()}
                                            </span>
                                            <span className={`status-badge status-${booking.status}`} style={{ display: 'block', marginTop: '4px', fontSize: '0.6rem' }}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* CTA Button */}
                        <button
                            style={{
                                width: '100%', padding: '0.75rem',
                                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                border: 'none', borderRadius: '0.5rem',
                                color: 'white', fontWeight: 600, fontSize: '0.9rem',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            onClick={() => navigate('/manage-bookings')}
                        >
                            Manage All Bookings <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// ==========================================
// 🌟 CLIENT DASHBOARD (FINAL OPTIMIZED)
// ==========================================
const ClientDashboard = ({ profile, navigate }) => {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        nextBooking: null,
        followingCount: 0,
        spotlight: null,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    const [showFollowing, setShowFollowing] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) { setLoading(false); return; }

            try {
                // Parallel fetch for speed
                const [bookingsRes, followRes, peersRes, activityRes] = await Promise.all([
                    api.get(`/bookings/client-dashboard/${userId}`).catch(() => ({ data: {} })),
                    api.get(`/profile/${userId}/follow-stats`).catch(() => ({ data: { followingCount: 0 } })),
                    api.get(`/recommendations/peers?userId=${userId}`).catch(() => ({ data: [] })),
                    api.get(`/activity/${userId}?limit=4`).catch(() => ({ data: [] }))
                ]);

                const recommendedPeers = peersRes.data || [];
                const topPhotographer = recommendedPeers.find(p => p.role === 'photographer') || recommendedPeers[0];

                let spotlightData = null;
                if (topPhotographer) {
                    spotlightData = {
                        id: topPhotographer.id,
                        name: topPhotographer.name,
                        category: topPhotographer.match > 0 ? `${topPhotographer.match}% Skill Match` : "Recommended Creator",
                        image: topPhotographer.avatar || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
                        rating: 4.9
                    };
                }

                setDashboardData({
                    totalBookings: bookingsRes.data.totalBookings || 0,
                    nextBooking: bookingsRes.data.nextBooking || null,
                    followingCount: followRes.data.followingCount || 0,
                    spotlight: spotlightData,
                    activities: activityRes.data || []
                });
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (showFollowing) {
            const fetchFollowingList = async () => {
                setLoadingFollowing(true);
                const userId = localStorage.getItem('user_id');
                try {
                    const { data } = await api.get(`/profile/${userId}/following`);
                    setFollowingList(Array.isArray(data) ? data : []);
                } catch (error) {
                    setFollowingList([]);
                } finally {
                    setLoadingFollowing(false);
                }
            };
            fetchFollowingList();
        }
    }, [showFollowing]);

    const formatBookingDate = (isoString) => {
        if (!isoString) return { day: '--', month: '---', fullTime: '--' };
        const date = new Date(isoString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dayPrefix = "";
        if (date.toDateString() === today.toDateString()) dayPrefix = "Today, ";
        else if (date.toDateString() === tomorrow.toDateString()) dayPrefix = "Tomorrow, ";

        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            fullTime: `${dayPrefix}${date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })}`
        };
    };

    if (loading) return <div className="text-center text-muted" style={{ padding: '2rem' }}>Loading your dashboard...</div>;

    const formattedDate = dashboardData.nextBooking ? formatBookingDate(dashboardData.nextBooking.start_time) : null;

    return (
        <div className="client-dashboard-wrapper">
            <div className="dashboard-hero-row">
                <div className="hero-widget welcome-widget">
                    <div className="widget-content">
                        <h2>Ready for your close-up?</h2>
                        <p>You have <strong>{dashboardData.nextBooking ? '1 upcoming shoot' : '0 upcoming shoots'}</strong> and <strong>0 unread messages</strong>.</p>
                        <div className="hero-search-pill">
                            <Search size={18} className="text-muted" />
                            <input type="text" placeholder="Find a photographer..." />
                        </div>
                    </div>
                    <div className="hero-decoration"><Camera size={120} strokeWidth={1} className="deco-icon" /></div>
                </div>
                <div className="hero-widget stats-widget-vertical">
                    <div className="mini-stat-row" onClick={() => setShowFollowing(true)}>
                        <div className="icon-box pink"><Users size={20} /></div>
                        <div>
                            <span className="stat-num">{dashboardData.followingCount}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="mini-stat-row" onClick={() => navigate('/my-bookings')}>
                        <div className="icon-box purple"><Calendar size={20} /></div>
                        <div>
                            <span className="stat-num">{dashboardData.totalBookings}</span>
                            <span className="stat-label">Bookings</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-widgets-grid">
                <div className="widget-column left">
                    <div className="dashboard-card next-up-card">
                        <div className="card-header-row">
                            <h3>Up Next</h3>
                            <button className="btn-icon-only"><MoreVertical size={16} /></button>
                        </div>

                        {dashboardData.nextBooking ? (
                            <>
                                <div className="next-booking-display">
                                    <div className="nb-date-circle">
                                        <span className="nb-day">{formattedDate.day}</span>
                                        <span className="nb-month">{formattedDate.month}</span>
                                    </div>
                                    <div className="nb-info">
                                        <h4>{dashboardData.nextBooking.photographer_name}</h4>
                                        <p className="nb-time"><Clock size={12} /> {formattedDate.fullTime}</p>
                                        <p className="nb-loc"><MapPin size={12} /> {dashboardData.nextBooking.special_requirements || "On Location"}</p>
                                    </div>
                                </div>
                                <div className="nb-actions">
                                    <button className="btn-glass" onClick={() => navigate('/my-bookings')}>View Ticket</button>
                                    <button className="btn-glass-icon"><MessageSquare size={16} /></button>
                                </div>
                            </>
                        ) : (
                            <div className="next-booking-display" style={{ padding: '2rem 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                                <p className="text-muted">No upcoming bookings. Time to explore!</p>
                                <button className="btn-glass" style={{ width: 'auto', padding: '0.6rem 1.5rem' }} onClick={() => navigate('/explore')}>
                                    Find a Photographer
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="dashboard-card feed-card">
                        <div className="card-header-row">
                            <h3>Activity Feed</h3>
                            <button className="btn-link-sm" onClick={() => navigate('/activity')}>View All</button>
                        </div>
                        <div className="feed-list">
                            {dashboardData.activities.length > 0 ? (
                                dashboardData.activities.map(notif => (
                                    <div key={notif.id} className="feed-item">
                                        <div className="feed-icon">
                                            {notif.type === 'follow' && <Users size={14} className="text-purple" />}
                                            {notif.type === 'booking' && <CheckCircle size={14} className="text-green-400" />}
                                            {notif.type === 'comment' && <MessageSquare size={14} className="text-blue-400" />}
                                            {notif.type === 'vote' && <Sparkles size={14} className="text-yellow-400" />}
                                            {!['follow', 'booking', 'comment', 'vote'].includes(notif.type) && <Bell size={14} className="text-muted" />}
                                        </div>
                                        <div className="feed-text">
                                            <p>{notif.content}</p>
                                            <span>{new Date(notif.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>No recent activity. Start exploring!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="widget-column right">
                    {dashboardData.spotlight ? (
                        <div className="dashboard-card spotlight-card" onClick={() => navigate(`/profile/${dashboardData.spotlight.id}`)}>
                            <div className="spotlight-image">
                                <img src={dashboardData.spotlight.image} alt={dashboardData.spotlight.name} />
                                <div className="spotlight-badge">Trending</div>
                            </div>
                            <div className="spotlight-content">
                                <div className="spotlight-info">
                                    <h4>{dashboardData.spotlight.name}</h4>
                                    <p>{dashboardData.spotlight.category}</p>
                                </div>
                                <div className="spotlight-rating"><Star size={14} fill="white" color="white" /> {dashboardData.spotlight.rating}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="dashboard-card spotlight-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem', background: '#121214', cursor: 'default' }}>
                            <Sparkles size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>No Trending Creators</h4>
                            <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.875rem' }}>Check back later to discover top photographers in your area.</p>
                        </div>
                    )}

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

            {showFollowing && (
                <div className="modal-overlay" onClick={() => setShowFollowing(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Following</h2>
                                <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
                                    You are following {followingList.length} creators
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setShowFollowing(false)}><X size={24} /></button>
                        </div>

                        <div className="follower-list-container">
                            {loadingFollowing ? (
                                <div className="state-message">
                                    <Loader2 className="animate-spin" /> Loading...
                                </div>
                            ) : followingList.length === 0 ? (
                                <div className="state-message">
                                    <Users size={32} style={{ opacity: 0.5, marginBottom: 10 }} />
                                    You aren't following anyone yet.
                                </div>
                            ) : (
                                <div className="follower-grid">
                                    {followingList.map(person => (
                                        <div
                                            key={person.id}
                                            className="follower-card-classic"
                                            onClick={() => navigate(`/profile/${person.id}`)}
                                        >
                                            <div className="fc-left">
                                                {person.avatar ? (
                                                    <img src={person.avatar} alt={person.name} className="fc-avatar" />
                                                ) : (
                                                    <div className="fc-avatar-placeholder">
                                                        {person.name ? person.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                                <div className="fc-info">
                                                    <h4>{person.name}</h4>
                                                    <p>{person.role || "Creator"}</p>
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
        </div>
    );
};

// ==========================================
// 🚀 MAIN DASHBOARD CONTAINER
// ==========================================
const Dashboard = () => {
    const navigate = useNavigate();
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