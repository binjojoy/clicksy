import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";
import { Camera, MapPin, Globe, Instagram, Twitter, Mail, DollarSign, User, Briefcase } from "lucide-react";
import './EditProfile.css';

const EditProfile = () => {
    // 1. STATE: Matches your 'public.profiles' schema
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        full_name: "",
        email: "user@example.com", // Read-only from Auth
        user_type: "Photographer", // "Client" or "Photographer"
        avatar_url: null,
        bio: "",
        location: "",
        phone_number: "",
        
        // Professional Fields
        skills: [], // Array in DB, handled as string in UI then split
        hourly_rate: "",
        portfolio_intro: "",
        
        // Social Links (JSONB in DB)
        social_links: {
            instagram: "",
            twitter: "",
            portfolio: ""
        }
    });

    // Temp state for the skills input string (comma separated)
    const [skillsInput, setSkillsInput] = useState("");

    // 2. MOCK FETCH (Simulate loading existing data)
    useEffect(() => {
        // In the future: const { data } = await supabase.from('profiles').select('*').single();
        // For now, load dummy data
        setProfile({
            full_name: "John Doe",
            email: "john@clicksy.com",
            user_type: "Photographer",
            avatar_url: null,
            bio: "Passionate about capturing the raw emotions of life.",
            location: "Kochi, Kerala",
            phone_number: "+91 9876543210",
            skills: ["Wedding", "Portrait"],
            hourly_rate: "50.00",
            portfolio_intro: "I specialize in candid wedding photography.",
            social_links: {
                instagram: "john_clicks",
                twitter: "johnny_p",
                portfolio: "www.johndoe.com"
            }
        });
        setSkillsInput("Wedding, Portrait");
    }, []);

    // 3. HANDLERS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            social_links: { ...prev.social_links, [name]: value }
        }));
    };

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setProfile(prev => ({ ...prev, avatar_url: previewUrl }));
            // Note: In backend integration, you will upload to bucket here
            toast.success("Avatar updated (Preview mode)");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert skills string back to array
        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);

        const payload = {
            ...profile,
            skills: skillsArray
        };

        console.log("Saving to DB:", payload);
        
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile saved successfully!");
        }, 1000);
    };

    return (
        <div className="edit-profile-page">
            <Navbar />
            
            <div className="edit-layout">
                {/* --- LEFT SIDEBAR: AVATAR & NAV --- */}
                <aside className="profile-sidebar">
                    <div className="sidebar-card">
                        <div className="avatar-upload-wrapper">
                            <div className="avatar-preview">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" />
                                ) : (
                                    <div className="avatar-placeholder">{profile.full_name?.charAt(0) || "U"}</div>
                                )}
                                <label className="avatar-edit-btn">
                                    <Camera size={16} />
                                    <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <h2 className="sidebar-name">{profile.full_name || "Your Name"}</h2>
                            <p className="sidebar-role">{profile.user_type}</p>
                            <p className="sidebar-location"><MapPin size={12} /> {profile.location || "No Location"}</p>
                        </div>

                        <div className="sidebar-menu">
                            <div className="menu-item active"><User size={18} /> Personal Info</div>
                            {profile.user_type === 'Photographer' && (
                                <div className="menu-item"><Briefcase size={18} /> Professional</div>
                            )}
                            <div className="menu-item"><Globe size={18} /> Social Links</div>
                        </div>
                    </div>
                </aside>

                {/* --- RIGHT CONTENT: FORMS --- */}
                <main className="profile-content">
                    <form onSubmit={handleSubmit}>
                        
                        {/* 1. PERSONAL DETAILS */}
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Personal Details</h3>
                                <p>This information will be displayed on your public profile.</p>
                            </div>
                            
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="full_name" 
                                        value={profile.full_name} 
                                        onChange={handleChange} 
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        value={profile.email} 
                                        disabled 
                                        className="input-disabled" 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone_number" 
                                        value={profile.phone_number} 
                                        onChange={handleChange} 
                                        placeholder="+91 00000 00000"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={profile.location} 
                                        onChange={handleChange} 
                                        placeholder="City, Country"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Bio</label>
                                    <textarea 
                                        name="bio" 
                                        rows="4" 
                                        value={profile.bio} 
                                        onChange={handleChange} 
                                        placeholder="Tell us a little about yourself..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 2. PROFESSIONAL DETAILS (Photographer Only) */}
                        {profile.user_type === 'Photographer' && (
                            <div className="content-card">
                                <div className="card-header">
                                    <h3>Professional Info</h3>
                                    <p>Highlight your skills and rates to attract clients.</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Hourly Rate ($)</label>
                                        <div className="input-with-icon">
                                            <DollarSign size={16} className="input-icon" />
                                            <input 
                                                type="number" 
                                                name="hourly_rate" 
                                                value={profile.hourly_rate} 
                                                onChange={handleChange} 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Skills (Comma separated)</label>
                                        <input 
                                            type="text" 
                                            value={skillsInput} 
                                            onChange={(e) => setSkillsInput(e.target.value)} 
                                            placeholder="Wedding, Portrait, Wildlife..."
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Portfolio Intro</label>
                                        <textarea 
                                            name="portfolio_intro" 
                                            rows="3" 
                                            value={profile.portfolio_intro} 
                                            onChange={handleChange} 
                                            placeholder="Short introduction for your portfolio page..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. SOCIAL LINKS */}
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Social Presence</h3>
                                <p>Where can clients find you online?</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Instagram Username</label>
                                    <div className="input-with-icon">
                                        <Instagram size={16} className="input-icon" />
                                        <input 
                                            type="text" 
                                            name="instagram" 
                                            value={profile.social_links.instagram} 
                                            onChange={handleSocialChange} 
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Twitter/X Handle</label>
                                    <div className="input-with-icon">
                                        <Twitter size={16} className="input-icon" />
                                        <input 
                                            type="text" 
                                            name="twitter" 
                                            value={profile.social_links.twitter} 
                                            onChange={handleSocialChange} 
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Website / Portfolio URL</label>
                                    <div className="input-with-icon">
                                        <Globe size={16} className="input-icon" />
                                        <input 
                                            type="text" 
                                            name="portfolio" 
                                            value={profile.social_links.portfolio} 
                                            onChange={handleSocialChange} 
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT AREA */}
                        <div className="action-bar">
                            <button type="button" className="btn-cancel">Discard</button>
                            <button type="submit" className="btn-save" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                    </form>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default EditProfile;