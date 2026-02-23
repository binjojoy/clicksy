import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js";
import { 
  Bell, ArrowLeft, CheckCircle, Users, 
  MessageSquare, Sparkles, Clock, Trash2 
} from "lucide-react";
import '../styles/Dashboard.css'; // Reusing your existing styles

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            // Fetching full history without the 'limit' parameter
            const { data } = await api.get(`/activity/${userId}`);
            setNotifications(data || []);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch(`/activity/read-all/${userId}`);
            // Optimistically update UI
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'follow': return <Users size={20} className="text-purple" />;
            case 'booking': return <CheckCircle size={20} className="text-green-400" />;
            case 'comment': return <MessageSquare size={20} className="text-blue-400" />;
            case 'vote': return <Sparkles size={20} className="text-yellow-400" />;
            default: return <Bell size={20} className="text-muted" />;
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="dashboard-main-content">
                <div className="content-wrapper" style={{ maxWidth: '800px' }}>
                    
                    {/* Header Section */}
                    <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button className="btn-icon-only" onClick={() => navigate(-1)}>
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="section-title" style={{ margin: 0 }}>Notification Center</h2>
                        </div>
                        {notifications.some(n => !n.is_read) && (
                            <button className="btn-link-sm" onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="notification-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <div className="state-message">Loading history...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <div 
                                    key={notif.id} 
                                    className={`follower-card-classic ${!notif.is_read ? 'unread-bg' : ''}`}
                                    style={{ cursor: 'default', padding: '1.25rem' }}
                                >
                                    <div className="fc-left" style={{ gap: '1.5rem' }}>
                                        <div className="fc-avatar-placeholder" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="fc-info">
                                            <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{notif.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: '#e4e4e7', lineHeight: '1.4' }}>{notif.content}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '8px', opacity: 0.6 }}>
                                                <Clock size={12} />
                                                <span style={{ fontSize: '0.75rem' }}>
                                                    {new Date(notif.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!notif.is_read && (
                                        <div style={{ width: '8px', height: '8px', background: '#7c3aed', borderRadius: '50%' }}></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="activity-card" style={{ textAlign: 'center', padding: '4rem' }}>
                                <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p className="text-muted">Your notification inbox is empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotificationsPage;