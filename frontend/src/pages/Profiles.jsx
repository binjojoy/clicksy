import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    Edit3, MapPin, Link as LinkIcon, Heart, ShieldCheck, 
    Grid, Bookmark, Sparkles, ArrowRight 
} from 'lucide-react';
import './Profiles.css';

const SignatureProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('portfolio');

    // --- MOCK DATA: "Best in Class" Content ---
    const user = {
        name: "Julianne Moore",
        role: "Visual Artist & Photographer",
        bio: "Specializing in cinematic portraits and high-fashion editorial work. \nMy goal is to capture the soul behind the eyes. Available for global commissions.",
        location: "New York, NY",
        website: "julianne.studio",
        // Cinematic Banner
        bannerImg: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
        // Pro Portrait
        avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
        stats: {
            shots: 142,
            followers: "12.5k",
            likes: "450k"
        }
    };

    // Masonry Grid Data
    const portfolio = [
        { id: 1, title: "Neon Nights", likes: 840, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" },
        { id: 2, title: "Urban Solitude", likes: 1200, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" },
        { id: 3, title: "Golden Hour", likes: 950, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
        { id: 4, title: "Abstract Flow", likes: 430, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
        { id: 5, title: "The Wedding", likes: 2100, img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
        { id: 6, title: "Vintage Car", likes: 670, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80" },
    ];

    // Recommendations
    const recommendations = [
        { id: 101, name: "David Chen", role: "Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200" },
        { id: 102, name: "Sarah J.", role: "Art Director", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200" },
        { id: 103, name: "Mike Ross", role: "Cinematographer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200" },
        { id: 104, name: "Elena G.", role: "Model", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200" },
        { id: 105, name: "Arjun K.", role: "Photographer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200" },
    ];

    return (
        <div className="sig-page-wrapper">
            <Navbar />

            {/* 1. CINEMATIC BANNER */}
            <div className="sig-banner" style={{ backgroundImage: `url(${user.bannerImg})` }}></div>

            <div className="sig-container">
                
                {/* 2. FLOATING GLASS CARD */}
                <div className="sig-card">
                    {/* Avatar Block */}
                    <div className="sig-avatar-wrapper">
                        <img src={user.avatarImg} alt="Profile" className="sig-avatar" />
                        <div className="sig-verified"><ShieldCheck size={20} /></div>
                    </div>

                    {/* Info Block */}
                    <div className="sig-info">
                        <div className="sig-header-row">
                            <div className="sig-name-block">
                                <span className="sig-role">{user.role}</span>
                                <h1>{user.name}</h1>
                            </div>
                            
                            {/* THE EDIT BUTTON */}
                            <button className="sig-btn-edit" onClick={() => navigate('/edit-profile')}>
                                <Edit3 size={18} /> Edit Profile
                            </button>
                        </div>

                        <p className="sig-bio">
                            {user.bio}
                        </p>

                        <div className="flex gap-4 text-gray-400 text-sm mb-6">
                            <span className="flex items-center gap-1"><MapPin size={14}/> {user.location}</span>
                            <span className="flex items-center gap-1"><LinkIcon size={14}/> {user.website}</span>
                        </div>

                        {/* Modern Stats */}
                        <div className="sig-stats">
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{user.stats.shots}</span>
                                <span className="sig-stat-lbl">Shots</span>
                            </div>
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{user.stats.followers}</span>
                                <span className="sig-stat-lbl">Followers</span>
                            </div>
                            <div className="sig-stat-box">
                                <span className="sig-stat-val">{user.stats.likes}</span>
                                <span className="sig-stat-lbl">Appreciation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. DISCOVERY STRIP (Recommendation Engine) --- */}
                <div className="sig-rec-container">
                    
                    {/* Header */}
                    <div className="sig-rec-header">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-purple-400" />
                            <div>
                                <span className="sig-rec-title block">Similar Creators</span>
                                <span className="sig-rec-subtitle">Based on your style</span>
                            </div>
                        </div>
                        {/* LINK TO EXPLORE PAGE */}
                        <button className="sig-view-all-link" onClick={() => navigate('/explore')}>
                            View All
                        </button>
                    </div>
                    
                    <div className="sig-rec-list">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="sig-rec-card">
                                <img src={rec.img} alt={rec.name} className="sig-rec-avatar" />
                                <h4 className="sig-rec-name">{rec.name}</h4>
                                <span className="sig-rec-role">{rec.role}</span>
                                <button className="sig-btn-follow">Follow</button>
                            </div>
                        ))}

                        {/* THE "SEE MORE" CARD --> REDIRECTS TO EXPLORE */}
                        <div className="sig-rec-view-more" onClick={() => navigate('/explore')}>
                            <div className="sig-view-more-icon">
                                <ArrowRight size={24} />
                            </div>
                            <span className="font-semibold text-sm">Explore More</span>
                            <span className="text-xs mt-1 text-gray-500">Find 100+ others</span>
                        </div>
                    </div>
                </div>

                {/* 4. CONTENT AREA */}
                <div className="sig-content">
                    <div className="sig-tabs">
                        <button 
                            className={`sig-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
                            onClick={() => setActiveTab('portfolio')}
                        >
                            Portfolio
                        </button>
                        <button 
                            className={`sig-tab ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            Saved
                        </button>
                    </div>

                    {/* MASONRY GRID */}
                    {activeTab === 'portfolio' && (
                        <div className="sig-masonry">
                            {portfolio.map((item) => (
                                <div key={item.id} className="sig-item">
                                    <img src={item.img} alt={item.title} />
                                    <div className="sig-item-overlay">
                                        <span className="sig-item-title">{item.title}</span>
                                        <span className="sig-item-likes"><Heart size={14} fill="currentColor"/> {item.likes}</span>
                                    </div>
                                </div>
                            ))}
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