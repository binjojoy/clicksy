import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
    Edit3, MapPin, Link as LinkIcon, ShieldCheck, Bookmark, Loader2
} from 'lucide-react'; 
import AvatarFallback from '../components/AvatarFallback.jsx';
import '../styles/Profiles.css';

const ClientProfile = ({ profileId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // --- STATE ---
    const [profile, setProfile] = useState(null);
    const [followStats, setFollowStats] = useState({ following: 0 });
    const [bookingsCount, setBookingsCount] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0); 
        const fetchData = async () => {
            setLoading(true);
            try {
                const targetId = profileId || localStorage.getItem('user_id');
                const currentUserId = localStorage.getItem('user_id');
                
                if (!targetId) {
                    navigate('/login');
                    return;
                }

                // 1. Fetch main profile FIRST (Critical)
                const profileRes = await api.get(`/profile/${targetId}`);
                setProfile(profileRes.data);
                
                // 2. Fetch stats asynchronously (Non-Critical)
                api.get(`/profile/${targetId}/follow-stats?currentUserId=${currentUserId}`)
                    .then(followRes => {
                        setFollowStats({ following: followRes.data.followingCount || 0 });
                    })
                    .catch(err => console.warn("Follow stats unavailable or empty:", err));

                api.get(`/bookings/client/${targetId}`)
                    .then(bookingsRes => {
                        setBookingsCount(bookingsRes.data ? bookingsRes.data.length : 0);
                    })
                    .catch(err => console.warn("Client bookings unavailable or empty:", err));

            } catch (error) {
                console.error("Error loading client profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profileId, navigate]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;
    if (!profile) return <div className="text-white text-center pt-20">Profile not found.</div>;

    const displayBanner = profile.banner_url || "https://images.unsplash.com/photo-1518659929286-903ed7a206a2?auto=format&fit=crop&w=1600&q=80"; // A nice dark minimal fallback
    const isOwnProfile = localStorage.getItem('user_id') === profile.user_id;

    const formatNumber = (num) => {
        if (!num) return 0;
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    return (
        <div className="sig-page-wrapper">
            <Navbar />
            <div className="sig-banner" style={{ backgroundImage: `url(${displayBanner})` }}></div>

            <div className="sig-container" style={{ paddingBottom: '6rem' }}>
                <div className="sig-card">
                    <div className="sig-avatar-wrapper">
                        <AvatarFallback name={profile.full_name || localStorage.getItem('userName')} imageUrl={profile.avatar_url} size="xl" className="sig-avatar" />
                        {profile.is_verified && <div className="sig-verified"><ShieldCheck size={20} /></div>}
                    </div>

                    <div className="sig-info">
                        <div className="sig-header-row">
                            <div className="sig-name-block">
                                <span className="sig-role">Client</span>
                                <h1>{profile.full_name || localStorage.getItem('userName') || "Anonymous"}</h1>
                            </div>
                            
                            {/* ACTION BUTTONS */}
                            {isOwnProfile ? (
                                <button className="sig-btn-edit" onClick={() => navigate('/edit-profile')}>
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            ) : null}
                            {/* NOTE: No follow button for clients. Users cannot follow clients. */}
                        </div>

                        <p className="sig-bio">{profile.bio || "No bio added yet."}</p>

                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-6">
                            {profile.location && <span className="flex items-center gap-1"><MapPin size={14}/> {profile.location}</span>}
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                    <LinkIcon size={14}/> {profile.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>

                        {/* --- STATS SECTION --- */}
                        <div className="sig-stats" style={{ justifyContent: 'center' }}>
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{formatNumber(followStats.following)}</span>
                                <span className="sig-stat-lbl">Following</span>
                            </div>
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{formatNumber(bookingsCount)}</span>
                                <span className="sig-stat-lbl">Bookings</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sig-content">
                    <div className="sig-tabs">
                        <button className="sig-tab active">Saved Collections</button>
                    </div>
                    {/* Only Saved tab is active for clients by default */}
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl" style={{ marginTop: '2rem' }}>
                        <Bookmark size={40} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-bold text-white">Private Collections</h3>
                        <p className="text-gray-500">Items you save will appear here.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ClientProfile;
