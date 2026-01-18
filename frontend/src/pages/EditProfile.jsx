import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx"; // Assuming you have a toaster component
import api from '../services/api'; // Your Axios Instance (connected to backend)
import { supabase } from '../config/supabaseClient'; // ONLY for Image Upload
import { Camera, MapPin, Globe, Instagram, Twitter, User, Briefcase, Link as LinkIcon, Save, Loader2 } from "lucide-react";
import './EditProfile.css';

const EditProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initial State
    const [profile, setProfile] = useState({
        user_id: null,
        full_name: "",
        email: "",
        user_type: "Client", 
        avatar_url: null,
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

    // 1. FETCH PROFILE (Via Backend API)
    // 1. FETCH PROFILE (Improved & Debugged)
    // 1. FETCH PROFILE (Using YOUR Local Storage Keys)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // A. READ FROM YOUR SPECIFIC KEYS
                const localUserId = localStorage.getItem('user_id'); 
                const localUserName = localStorage.getItem('userName');
                const localUserRole = localStorage.getItem('userRole');

                console.log("1. Local Storage Check:", { localUserId, localUserName });

                if (!localUserId) {
                    toast.error("Please login first.");
                    // navigate('/login'); // Uncomment if using react-router
                    return; 
                }

                // B. Fetch Profile Data from Backend
                // We use the ID found in your local storage
                const response = await api.get(`/profile/${localUserId}`);
                const dbData = response.data;

                console.log("2. Data from Backend:", dbData);

                if (dbData) {
                    setProfile(prev => ({
                        ...prev, 
                        ...dbData, // This fills the form with DB data
                        user_id: localUserId, 
                        
                        // Fallbacks: Use Local Storage if DB is empty
                        full_name: dbData.full_name || localUserName || "",
                        user_type: dbData.user_type || localUserRole || "Client",
                        
                        // Safe defaults
                        social_links: dbData.social_links || { instagram: "", twitter: "", website: "" },
                        skills: dbData.skills || [],
                        hourly_rate: dbData.hourly_rate ? String(dbData.hourly_rate) : ""
                    }));

                    // C. Handle Skills Input for the UI
                    if (dbData.skills && Array.isArray(dbData.skills)) {
                        setSkillsInput(dbData.skills.join(", "));
                    }
                }

            } catch (error) {
                console.error("Error fetching profile:", error);
                // Even if backend fails, at least show the name from local storage
                const localUserName = localStorage.getItem('userName');
                if (localUserName) {
                     setProfile(prev => ({ ...prev, full_name: localUserName }));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 2. INPUT HANDLERS
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

    // 3. AVATAR UPLOAD (Direct to Supabase Storage)
    // We keep this direct because sending binary files via simple JSON API routes is complex
    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('avatars') 
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update local state immediately so user sees the change
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            toast.success("Avatar uploaded!");

        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    // 4. SUBMIT UPDATE (Via Backend API)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);

            // Prepare payload
            const payload = {
                ...profile,
                skills: skillsArray
            };

            // Call your new route: PUT /api/v1/profile
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
                {/* --- LEFT SIDEBAR: IDENTITY --- */}
                <aside>
                    <div className="sidebar-card">
                        <div className="avatar-section">
                            <div className="avatar-wrapper">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="avatar-img" />
                                ) : (
                                    <div className="avatar-placeholder">{profile.full_name?.charAt(0) || "U"}</div>
                                )}
                                
                                <label className="avatar-edit-badge">
                                    {uploading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
                                    <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} disabled={uploading} />
                                </label>
                            </div>
                            
                            <h2 className="profile-name">{profile.full_name || "Your Name"}</h2>
                            <div className="profile-role-badge">{profile.user_type}</div>
                            
                            {profile.is_verified && (
                                <div className="verified-badge">
                                    ✓ Verified Pro
                                </div>
                            )}
                        </div>

                        <div className="sidebar-nav">
                            <button className="nav-item active">
                                <User size={18} /> Personal Info
                            </button>
                            {profile.user_type === 'Photographer' && (
                                <button className="nav-item">
                                    <Briefcase size={18} /> Professional Details
                                </button>
                            )}
                            <button className="nav-item">
                                <Globe size={18} /> Social Links
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- RIGHT CONTENT: FORM --- */}
                <main>
                    <form onSubmit={handleSubmit} className="profile-form">
                        
                        {/* SECTION 1: BASICS */}
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Basic Information</h3>
                                <p>Manage your personal details and bio.</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" name="full_name" 
                                        value={profile.full_name || ''} onChange={handleChange} 
                                        placeholder="Jane Doe" 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email (Read Only)</label>
                                    <input type="email" value={profile.email || ''} disabled className="input-locked" />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" name="phone_number" 
                                        value={profile.phone_number || ''} onChange={handleChange} 
                                        placeholder="+1 234 567 890" 
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Location</label>
                                    <div className="input-icon-wrapper">
                                        <MapPin size={18} className="field-icon" />
                                        <input 
                                            type="text" name="location" 
                                            value={profile.location || ''} onChange={handleChange} 
                                            placeholder="City, Country" 
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Bio</label>
                                    <textarea 
                                        name="bio" rows="4" 
                                        value={profile.bio || ''} onChange={handleChange} 
                                        placeholder="Tell us a little about yourself..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: PROFESSIONAL (Photographer Only) */}
                        {profile.user_type === 'Photographer' && (
                            <div className="form-section mt-8">
                                <div className="section-header">
                                    <h3>Professional Portfolio</h3>
                                    <p>Highlight your skills and pricing to attract clients.</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Hourly Rate ($)</label>
                                        <input 
                                            type="number" name="hourly_rate" 
                                            value={profile.hourly_rate || ''} onChange={handleChange} 
                                            placeholder="0.00" 
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Skills (Comma separated)</label>
                                        <input 
                                            type="text" 
                                            value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} 
                                            placeholder="Wedding, Portrait, Wildlife..." 
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Portfolio Intro</label>
                                        <textarea 
                                            name="portfolio_intro" rows="3" 
                                            value={profile.portfolio_intro || ''} onChange={handleChange} 
                                            placeholder="Short intro for your portfolio page..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: SOCIALS */}
                        <div className="form-section mt-8">
                            <div className="section-header">
                                <h3>Social Presence</h3>
                                <p>Where can people find your work?</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Instagram</label>
                                    <div className="input-icon-wrapper">
                                        <Instagram size={18} className="field-icon" />
                                        <input 
                                            type="text" name="instagram" 
                                            value={profile.social_links?.instagram || ''} onChange={handleSocialChange} 
                                            placeholder="username" 
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Twitter / X</label>
                                    <div className="input-icon-wrapper">
                                        <Twitter size={18} className="field-icon" />
                                        <input 
                                            type="text" name="twitter" 
                                            value={profile.social_links?.twitter || ''} onChange={handleSocialChange} 
                                            placeholder="username" 
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Website</label>
                                    <div className="input-icon-wrapper">
                                        <LinkIcon size={18} className="field-icon" />
                                        <input 
                                            type="text" name="website" 
                                            value={profile.social_links?.website || ''} onChange={handleSocialChange} 
                                            placeholder="https://yourportfolio.com" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BAR */}
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