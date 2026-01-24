import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
    Edit3, MapPin, Link as LinkIcon, Heart, ShieldCheck, 
    Bookmark, Sparkles, ArrowRight, Loader2, UserPlus, Check
} from 'lucide-react'; // Added UserPlus, Check icons
import './Profiles.css';

const SignatureProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [activeTab, setActiveTab] = useState('portfolio');
    const [loading, setLoading] = useState(true);
    
    // --- STATE ---
    const [profile, setProfile] = useState(null);
    const [portfolioData, setPortfolioData] = useState([]);
    const [portfolioStats, setPortfolioStats] = useState({ shots: 0, likes: 0 });
    const [recommendations, setRecommendations] = useState([]);
    
    // --- NEW: FOLLOW STATE ---
    const [isFollowing, setIsFollowing] = useState(false);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });

    useEffect(() => {
        window.scrollTo(0, 0); 
        const fetchData = async () => {
            setLoading(true);
            try {
                const targetId = id || localStorage.getItem('user_id');
                const currentUserId = localStorage.getItem('user_id');
                
                if (!targetId) {
                    navigate('/login');
                    return;
                }

                // Parallel Fetch: Profile + Portfolio + Recs + FOLLOW STATS
                const [profileRes, portfolioRes, recRes, followRes] = await Promise.all([
                    api.get(`/profile/${targetId}`),
                    api.get(`/profile/${targetId}/portfolio`),
                    api.get(`/recommendations/peers?userId=${targetId}`),
                    // New Route Call
                    api.get(`/profile/${targetId}/follow-stats?currentUserId=${currentUserId}`)
                ]);

                setProfile(profileRes.data);
                setPortfolioData(portfolioRes.data.portfolio);
                setPortfolioStats(portfolioRes.data.stats);
                setRecommendations(recRes.data);
                
                // Set Follow Data
                setIsFollowing(followRes.data.isFollowing);
                setFollowStats({
                    followers: followRes.data.followersCount,
                    following: followRes.data.followingCount
                });

            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // --- NEW: HANDLE FOLLOW ACTION ---
    const handleFollow = async () => {
        const currentUserId = localStorage.getItem('user_id');
        if (!currentUserId || !profile) return;

        // 1. Optimistic Update (Instant Feedback)
        const previousState = isFollowing;
        setIsFollowing(!previousState);
        setFollowStats(prev => ({
            ...prev,
            followers: previousState ? prev.followers - 1 : prev.followers + 1
        }));

        try {
            // 2. API Call
            await api.post(`/profile/${profile.user_id}/follow`, { userId: currentUserId });
        } catch (err) {
            // 3. Revert on Error
            console.error("Follow failed", err);
            setIsFollowing(previousState);
            setFollowStats(prev => ({
                ...prev,
                followers: previousState ? prev.followers + 1 : prev.followers - 1
            }));
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;
    if (!profile) return <div className="text-white text-center pt-20">Profile not found.</div>;

    const displayAvatar = profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";
    const displayBanner = profile.banner_url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80";
    const isOwnProfile = localStorage.getItem('user_id') === profile.user_id;

    // Helper for formatting stats
    const formatNumber = (num) => {
        if (!num) return 0;
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    return (
        <div className="sig-page-wrapper">
            <Navbar />
            <div className="sig-banner" style={{ backgroundImage: `url(${displayBanner})` }}></div>

            <div className="sig-container">
                <div className="sig-card">
                    <div className="sig-avatar-wrapper">
                        <img src={displayAvatar} alt="Profile" className="sig-avatar" />
                        {profile.is_verified && <div className="sig-verified"><ShieldCheck size={20} /></div>}
                    </div>

                    <div className="sig-info">
                        <div className="sig-header-row">
                            <div className="sig-name-block">
                                <span className="sig-role">{profile.user_type || "Creator"}</span>
                                <h1>{profile.full_name || "Anonymous"}</h1>
                            </div>
                            
                            {/* --- THE CONTEXTUAL BUTTON SWAP --- */}
                            {isOwnProfile ? (
                                // A. Edit Profile (If it's me)
                                <button className="sig-btn-edit" onClick={() => navigate('/edit-profile')}>
                                    <Edit3 size={18} /> Edit Profile
                                </button>
                            ) : (
                                // B. Follow Button (If it's someone else)
                                // Reusing the exact same CSS class 'sig-btn-edit' ensures layout stays identical
                                // We add inline style overrides just to change the color/appearance slightly
                                <button 
                                    className="sig-btn-edit" 
                                    onClick={handleFollow}
                                    style={{
                                        backgroundColor: isFollowing ? 'transparent' : '#7c3aed', // Purple if not following
                                        borderColor: isFollowing ? '#52525b' : '#7c3aed',
                                        color: isFollowing ? '#a1a1aa' : 'white'
                                    }}
                                >
                                    {isFollowing ? (
                                        <><Check size={18} /> Following</>
                                    ) : (
                                        <><UserPlus size={18} /> Follow</>
                                    )}
                                </button>
                            )}
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

                        {/* --- STATS SECTION (Now Fully Dynamic) --- */}
                        <div className="sig-stats">
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{portfolioStats.shots}</span>
                                <span className="sig-stat-lbl">Shots</span>
                            </div>
                            <div className="sig-stat-box">
                                {/* DYNAMIC FOLLOWER COUNT */}
                                <span className="sig-stat-val">{formatNumber(followStats.followers)}</span>
                                <span className="sig-stat-lbl">Followers</span>
                            </div>
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{formatNumber(portfolioStats.likes)}</span>
                                <span className="sig-stat-lbl">Appreciation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations & Content Sections remain unchanged... */}
                <div className="sig-rec-container">
                    {/* ... (Keep existing code) ... */}
                    <div className="sig-rec-header">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-purple-400" />
                            <div><span className="sig-rec-title block">Similar Creators</span><span className="sig-rec-subtitle">Based on your style</span></div>
                        </div>
                        <button className="sig-view-all-link" onClick={() => navigate('/community')}>View All</button>
                    </div>
                    <div className="sig-rec-list">
                        {recommendations.slice(0, 5).map((rec) => (
                            <div key={rec.id} className="sig-rec-card">
                                <img src={rec.avatar || `https://ui-avatars.com/api/?name=${rec.name}&background=random`} alt={rec.name} className="sig-rec-avatar" />
                                <h4 className="sig-rec-name">{rec.name}</h4>
                                <span className="sig-rec-role">{rec.role}</span>
                                <button className="sig-btn-follow" onClick={() => navigate(`/profile/${rec.id}`)}>View</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sig-content">
                    <div className="sig-tabs">
                        <button className={`sig-tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
                        <button className={`sig-tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved</button>
                    </div>
                    {activeTab === 'portfolio' && (
                        <div className="sig-masonry">
                            {portfolioData.length > 0 ? portfolioData.map((item) => (
                                <div key={item.id} className="sig-item">
                                    <img src={item.image_url} alt={item.title} />
                                    <div className="sig-item-overlay">
                                        <span className="sig-item-title">{item.title}</span>
                                        <span className="sig-item-likes"><Heart size={14} fill="currentColor"/> {item.likes}</span>
                                    </div>
                                </div>
                            )) : <div className="text-center text-gray-500 w-full py-10">No shots uploaded yet.</div>}
                        </div>
                    )}
                    {activeTab === 'saved' && (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
                            <Bookmark size={40} className="mx-auto mb-4 text-gray-600" />
                            <h3 className="text-xl font-bold text-white">Private Collections</h3>
                            <p className="text-gray-500">Items you save will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignatureProfile;