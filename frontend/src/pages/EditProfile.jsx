import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx"; 
import api from '../services/api'; 
import { supabase } from '../services/supabaseClient'; 
import { Camera, MapPin, Globe, Instagram, Twitter, User, Briefcase, Link as LinkIcon, Save, Loader2, Image as ImageIcon } from "lucide-react";
import '../styles/EditProfile.css';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Upload States
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    // Tab State (Fixes the "Irresponsive Tab" issue)
    const [activeTab, setActiveTab] = useState('personal'); // Options: 'personal', 'professional', 'social'

    // Profile State
    const [profile, setProfile] = useState({
        user_id: null,
        full_name: "",
        email: "",
        user_type: "Client", 
        avatar_url: null,
        banner_url: null, 
        bio: "",
        location: "",
        phone_number: "",
        skills: [], 
        hourly_rate: "",
        portfolio_intro: "",
        social_links: { instagram: "", twitter: "", website: "" }, 
        is_verified: false
    });

    const [skillsInput, setSkillsInput] = useState("");

    // 1. FETCH PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const localUserId = localStorage.getItem('user_id'); 
                const localUserName = localStorage.getItem('userName');
                const localUserRole = localStorage.getItem('userRole');

                if (!localUserId) {
                    toast.error("Please login first.");
                    return; 
                }

                const response = await api.get(`/profile/${localUserId}`);
                const dbData = response.data;

                if (dbData) {
                    // FIX: Explicitly checking and setting URL fields ensures they pre-render
                    setProfile(prev => ({
                        ...prev, 
                        ...dbData,
                        user_id: localUserId, 
                        full_name: dbData.full_name || localUserName || "",
                        user_type: dbData.user_type || localUserRole || "Client",
                        
                        // Crucial Fix for Images:
                        avatar_url: dbData.avatar_url || null, 
                        banner_url: dbData.banner_url || null,
                        
                        social_links: dbData.social_links || { instagram: "", twitter: "", website: "" },
                        skills: dbData.skills || [],
                        hourly_rate: dbData.hourly_rate ? String(dbData.hourly_rate) : ""
                    }));

                    if (dbData.skills && Array.isArray(dbData.skills)) {
                        setSkillsInput(dbData.skills.join(", "));
                    }
                }

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 2. HANDLERS
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

    // 3. IMAGE UPLOAD LOGIC
    const uploadImage = async (file, bucket) => {
        const uid = profile.user_id || localStorage.getItem('user_id');
        if (!uid) throw new Error("User ID missing");

        const fileExt = file.name.split('.').pop();
        const fileName = `${uid}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; 

        const { error: uploadError } = await supabase.storage
            .from(bucket) 
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
            
        return publicUrl;
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploadingAvatar(true);
            const file = event.target.files[0];
            if (!file) return;

            const publicUrl = await uploadImage(file, 'avatars');
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            toast.success("Avatar uploaded! Save to apply.");
        } catch (error) {
            toast.error("Avatar upload failed.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleBannerUpload = async (event) => {
        try {
            setUploadingBanner(true);
            const file = event.target.files[0];
            if (!file) return;

            const publicUrl = await uploadImage(file, 'banners');
            setProfile(prev => ({ ...prev, banner_url: publicUrl }));
            toast.success("Banner uploaded! Save to apply.");
        } catch (error) {
            toast.error("Banner upload failed.");
        } finally {
            setUploadingBanner(false);
        }
    };

    // 4. SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);
            const payload = { ...profile, skills: skillsArray };
            
            const response = await api.put('/profile', payload);
            if (response.status === 200) {
                toast.success("Profile saved successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Could not save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-purple-500" size={40} />
        </div>
    );

    return (
        <div className="edit-profile-page">
            <Navbar />
            
            <div className="edit-layout">
                {/* --- SIDEBAR --- */}
                <aside>
                    <div className="sidebar-card">
                        
                        {/* BANNER PREVIEW */}
                        <div className="banner-edit-section" style={{
                            backgroundImage: profile.banner_url ? `url(${profile.banner_url})` : 'linear-gradient(to right, #27272a, #3f3f46)',
                            height: '80px', borderRadius: '12px', marginBottom: '-40px', position: 'relative', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center'
                        }}>
                            <label className="banner-edit-btn" title="Change Banner">
                                {uploadingBanner ? <Loader2 size={14} className="animate-spin"/> : <ImageIcon size={14} />}
                                <input type="file" accept="image/*" hidden onChange={handleBannerUpload} disabled={uploadingBanner} />
                            </label>
                        </div>

                        {/* AVATAR PREVIEW */}
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="avatar-img" />
                                ) : (
                                    <div className="avatar-placeholder">{profile.full_name?.charAt(0) || "U"}</div>
                                )}
                                
                                <label className="avatar-edit-badge">
                                    {uploadingAvatar ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
                                    <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                </label>
                            </div>
                            
                            <h2 className="profile-name">{profile.full_name || "Your Name"}</h2>
                            <div className="profile-role-badge">{profile.user_type}</div>
                        </div>

                        {/* NAV TABS (FIXED: Now they actually work) */}
                        <div className="sidebar-nav">
                            <button 
                                type="button" 
                                className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
                                onClick={() => setActiveTab('personal')}
                            >
                                <User size={18} /> Personal Info
                            </button>
                            
                            {profile.user_type === 'Photographer' && (
                                <button 
                                    type="button" 
                                    className={`nav-item ${activeTab === 'professional' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('professional')}
                                >
                                    <Briefcase size={18} /> Professional Details
                                </button>
                            )}
                            
                            <button 
                                type="button" 
                                className={`nav-item ${activeTab === 'social' ? 'active' : ''}`}
                                onClick={() => setActiveTab('social')}
                            >
                                <Globe size={18} /> Social Links
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN FORM CONTENT --- */}
                <main>
                    <form onSubmit={handleSubmit} className="profile-form">
                        
                        {/* TAB 1: PERSONAL INFO */}
                        {activeTab === 'personal' && (
                            <div className="form-section fade-in">
                                <div className="section-header">
                                    <h3>Basic Information</h3>
                                    <p>Manage your personal details and bio.</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Full Name</label>
                                        <input type="text" name="full_name" value={profile.full_name || ''} onChange={handleChange} placeholder="Jane Doe" />
                                    </div>

                                    <div className="form-group">
                                        <label>Email (Read Only)</label>
                                        <input type="email" value={profile.email || ''} disabled className="input-locked" />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input type="tel" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} placeholder="+1 234 567 890" />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Location</label>
                                        <div className="input-icon-wrapper">
                                            <MapPin size={18} className="field-icon" />
                                            <input type="text" name="location" value={profile.location || ''} onChange={handleChange} placeholder="City, Country" />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Bio</label>
                                        <textarea name="bio" rows="4" value={profile.bio || ''} onChange={handleChange} placeholder="Tell us a little about yourself..."></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: PROFESSIONAL INFO */}
                        {activeTab === 'professional' && profile.user_type === 'Photographer' && (
                            <div className="form-section mt-8 fade-in">
                                <div className="section-header">
                                    <h3>Professional Portfolio</h3>
                                    <p>Highlight your skills and pricing to attract clients.</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Hourly Rate ($)</label>
                                        <input type="number" name="hourly_rate" value={profile.hourly_rate || ''} onChange={handleChange} placeholder="0.00" />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Skills (Comma separated)</label>
                                        <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Wedding, Portrait, Wildlife..." />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Portfolio Intro</label>
                                        <textarea name="portfolio_intro" rows="3" value={profile.portfolio_intro || ''} onChange={handleChange} placeholder="Short intro for your portfolio page..."></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: SOCIAL LINKS */}
                        {activeTab === 'social' && (
                            <div className="form-section mt-8 fade-in">
                                <div className="section-header">
                                    <h3>Social Presence</h3>
                                    <p>Where can people find your work?</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Instagram</label>
                                        <div className="input-icon-wrapper">
                                            <Instagram size={18} className="field-icon" />
                                            <input type="text" name="instagram" value={profile.social_links?.instagram || ''} onChange={handleSocialChange} placeholder="username" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Twitter / X</label>
                                        <div className="input-icon-wrapper">
                                            <Twitter size={18} className="field-icon" />
                                            <input type="text" name="twitter" value={profile.social_links?.twitter || ''} onChange={handleSocialChange} placeholder="username" />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Website</label>
                                        <div className="input-icon-wrapper">
                                            <LinkIcon size={18} className="field-icon" />
                                            <input type="text" name="website" value={profile.social_links?.website || ''} onChange={handleSocialChange} placeholder="https://yourportfolio.com" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ACTION BAR (Always Visible) */}
                        <div className="sticky-action-bar">
                            <button type="button" className="btn-cancel" onClick={() => window.location.reload()}>Discard</button>
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {saving ? "Saving..." : "Save Changes"}
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