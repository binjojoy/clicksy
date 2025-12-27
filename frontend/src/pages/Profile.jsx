import React, { useState } from 'react'; 
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";
import { useNavigate } from 'react-router-dom';

// Reusing the structure of the AvatarUpload component
const AvatarUpload = ({ avatarUrl }) => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      {/* Reusing the dark, primary-bordered circle structure */}
      <div 
        className="rounded-full flex items-center justify-center border-primary" 
        style={{ height: '7rem', width: '7rem', border: '4px solid var(--primary-color)', backgroundColor: 'var(--card-background)', overflow: 'hidden' }}
      >
        {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="h-12 w-12 text-muted-foreground mx-auto"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
        )}
      </div>
    </div>
  );
};

const EditProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    bio: "A passionate photographer focused on capturing timeless moments. Specializing in wedding and portrait photography.",
    location: "New York, NY",
    skills: ["Portrait", "Wedding", "Events", "Landscape"],
    hourlyRate: 150.00,
    portfolioIntro: "Hello! I'm John, and I love creating stunning visual stories. View my work below!",
    socialLinks: { twitter: "johndoephoto", instagram: "johndoe_clicks" },
    avatarUrl: null,
    userType: "Photographer"
  });
   const navigate = useNavigate();
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const isPhotographer = profile.userType === "Photographer";

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        {/* Container with explicit max-width set to reduce the size, matching the previous request */}
        <div className="container" style={{ maxWidth: '758px' }}> 
          
          {/* Main Heading Section (Reusable) */}
          <div className="text-center mb-12">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto mb-4"
              style={{ color: 'var(--primary)' }}
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Edit Your Profile
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your personal and professional details
            </p>
          </div>
          
          {/* Main Form Card - REUSING THE .card CLASS NAME */}
          <div className="card"> 
            <div className="card-content">
              <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-10"> {/* Added padding directly to form for better layout */}
                
                {/* Avatar Section */}
                <AvatarUpload avatarUrl={profile.avatarUrl} />
                
                {/* --- 1. Basic Info Section --- */}
                <div className="space-y-6">
                  {/* REUSING card-header, card-title, card-description CLASS NAMES */}
                  <div className="card-header border-b border-border pb-4"> 
                    <h2 className="card-title text-2xl font-semibold">Basic Info</h2>
                    <p className="card-description text-muted-foreground text-lg">Your public identity and contact details.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* REUSING input-group, label, input CLASS NAMES */}
                    <div className="input-group">
                      <label htmlFor="fullName" className="label">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        value=""
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="email" className="label">Email</label>
                      <input
                        id="email"
                        type="email"
                        value=""
                        readOnly
                        className="input" // Assuming the styling for read-only is handled by the .input class
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                      <label htmlFor="phoneNumber" className="label">Phone Number</label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value=""
                        onChange={handleChange}
                        className="input"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="location" className="label">Location</label>
                      <input
                        id="location"
                        type="text"
                        value=""
                        onChange={handleChange}
                        className="input"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="bio" className="label">Bio</label>
                    <textarea
                      id="bio"
                      value=""
                      onChange={handleChange}
                      className="textarea" // REUSING .textarea CLASS NAME
                      rows="4"
                      placeholder="A short description about yourself..."
                    />
                  </div>
                </div>

                {/* --- 2. Photographer/Pro Info Section (Conditional) --- */}
                {isPhotographer && (
                  <div className="space-y-6 pt-8">
                    <div className="card-header border-b border-border pb-4">
                      <h2 className="card-title text-2xl font-semibold text-primary">Photographer Details</h2>
                      <p className="card-description text-muted-foreground text-lg">Professional details for the marketplace.</p>
                    </div>

                    <div className="input-group">
                      <label htmlFor="portfolioIntro" className="label">Portfolio Introduction</label>
                      <textarea
                        id="portfolioIntro"
                        value=""
                        onChange={handleChange}
                        className="textarea"
                        rows="3"
                        placeholder="A brief, compelling intro to your work."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="input-group">
                        <label htmlFor="hourlyRate" className="label">Hourly Rate (USD)</label>
                        <input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value=""
                          onChange={handleChange}
                          className="input"
                          placeholder="e.g., 150.00"
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="skills" className="label">Skills/Specialties (Comma Separated)</label>
                        <input
                          id="skills"
                          type="text"
                          value="" 
                          onChange={(e) => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})}
                          className="input"
                          placeholder="Wedding, Portrait, Events, etc."
                        />
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    <div className="input-group">
                        <label className="label">Social Links (Instagram/Twitter Handles)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Instagram Handle"
                                value=""
                                className="input"
                            />
                            <input
                                type="text"
                                placeholder="Twitter/X Handle"
                                value=""
                                className="input"
                            />
                        </div>
                    </div>

                    {/* Verification Status (Read-Only) */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className={`h-3 w-3 rounded-full ${profile.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span>
                          Verification Status: {profile.isVerified ? 'Verified' : 'Pending/Not Verified'}
                        </span>
                    </div>
                  </div>
                )}
                
                {/* Submit Button - Reusing the primary gradient button classes */}
                <button 
                  type="submit" 
                  className="btn-primary-gradient font-semibold rounded-lg" 
                  style={{ width: '100%', padding: '0.75rem 1.5rem', marginTop: '1.5rem' }}
                  onClick={()=>{
                   
                    navigate("/dashboard");
                  }}
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EditProfile;