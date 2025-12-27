import React, { useState } from 'react'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";
import './EditProfile.css'; // Import the CSS above

const EditProfile = () => {
  // Static State matching your 'profiles' table schema
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    bio: "A passionate photographer focused on capturing timeless moments.",
    location: "New York, NY",
    
    // Photographer specific fields
    userType: "Photographer", // Change this to 'Client' to hide the pro section
    skills: "Wedding, Portrait, Events",
    hourlyRate: "150.00",
    portfolioIntro: "Hello! I'm John, and I love creating stunning visual stories.",
    instagram: "johndoe_clicks",
    twitter: "johndoephoto",
    
    // Avatar
    avatarUrl: null
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle Avatar File Selection (Local Preview Logic)
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a fake local URL so the user sees the image immediately
      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatarUrl: previewUrl }));
      toast.success("Photo selected!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Profile:", profile);
    toast.success("Profile updated successfully (Static Mode)");
  };

  const isPhotographer = profile.userType === "Photographer";

  return (
    <div className="edit-profile-page">
      <Navbar />

      <div className="edit-container">
        
        {/* --- 1. THE VALUABLE AVATAR HEADER --- */}
        <div className="avatar-section">
            
            <div className="avatar-wrapper">
                <div className="avatar-image-container">
                    {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="avatar-img" />
                    ) : (
                        // Default Placeholder Icon
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* The Overlay (Label for file input) */}
                <label className="avatar-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginBottom: '4px'}}>
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" className="hidden" style={{display:'none'}} onChange={handleAvatarChange} />
                </label>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                Edit Your Profile
            </h1>
            <p style={{ color: '#a1a1aa' }}>Manage your personal details and settings</p>
        </div>
        
        {/* --- 2. MAIN FORM CARD --- */}
        <div className="edit-card"> 
            <form onSubmit={handleSubmit}> 
            
            {/* Basic Info Section */}
            <div className="section-header"> 
                <h2 className="section-title">Basic Info</h2>
                <p className="section-desc">Your public identity and contact details.</p>
            </div>
            
            <div className="input-grid">
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        name="fullName"
                        type="text"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={profile.email}
                        readOnly
                        className="form-input"
                    />
                </div>
            </div>

            <div className="input-grid">
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        name="phoneNumber"
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                        name="location"
                        type="text"
                        value={profile.location}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="4"
                />
            </div>

            {/* --- Photographer Only Section --- */}
            {isPhotographer && (
                <div style={{ marginTop: '3rem' }}>
                    <div className="section-header"> 
                        <h2 className="section-title" style={{ color: '#a78bfa' }}>Professional Details</h2>
                        <p className="section-desc">Settings for your public marketplace listing.</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Portfolio Intro</label>
                        <textarea
                            name="portfolioIntro"
                            value={profile.portfolioIntro}
                            onChange={handleChange}
                            className="form-textarea"
                            rows="3"
                        />
                    </div>

                    <div className="input-grid">
                        <div className="form-group">
                            <label className="form-label">Hourly Rate ($)</label>
                            <input
                                name="hourlyRate"
                                type="number"
                                value={profile.hourlyRate}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skills (Comma Separated)</label>
                            <input
                                name="skills"
                                type="text"
                                value={profile.skills}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                    
                    {/* Social Links */}
                    <div className="form-group">
                        <label className="form-label">Social Handles</label>
                        <div className="input-grid">
                            <div className="social-input-wrapper">
                                <span className="social-icon">@</span>
                                <input
                                    name="instagram"
                                    type="text"
                                    placeholder="Instagram"
                                    value={profile.instagram}
                                    onChange={handleChange}
                                    className="form-input social-input"
                                />
                            </div>
                            <div className="social-input-wrapper">
                                <span className="social-icon">@</span>
                                <input
                                    name="twitter"
                                    type="text"
                                    placeholder="Twitter/X"
                                    value={profile.twitter}
                                    onChange={handleChange}
                                    className="form-input social-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <button type="submit" className="btn-save">
                Save Changes
            </button>

            </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;