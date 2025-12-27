import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import './Learn.css';

const Learn = () => {
  // 1. FILTER STATE
  const [activeFilter, setActiveFilter] = useState("All");

  // 2. RICH DATA (Images + difficulty levels)
  const resources = [
    {
      id: 1,
      title: "Mastering Manual Mode",
      description: "Stop shooting in Auto. Learn ISO, Aperture, and Shutter Speed in 45 minutes.",
      category: "Beginner",
      type: "Basics",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Cinematic Lighting Setup",
      description: "How to use a single softbox to create dramatic, professional portraits.",
      category: "Intermediate",
      type: "Lighting",
      duration: "1.5 hours",
      image: "https://images.unsplash.com/photo-1554048612-387768052bf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "The Business of Weddings",
      description: "Contracts, client management, and pricing your wedding packages.",
      category: "Advanced",
      type: "Business",
      duration: "2 hours",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      title: "Lightroom Color Grading",
      description: "Get that 'Teal and Orange' look and create your own presets.",
      category: "Intermediate",
      type: "Editing",
      duration: "55 min",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      title: "Pose Like a Pro",
      description: "A guide to directing models who aren't professional models.",
      category: "Beginner",
      type: "Portrait",
      duration: "30 min",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      title: "Drone Photography 101",
      description: "Legal requirements and composition tips for aerial shots.",
      category: "Beginner",
      type: "Gear",
      duration: "1.2 hours",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
  ];

  // Filter Logic
  const filters = ["All", "Basics", "Lighting", "Business", "Editing", "Gear"];
  
  const filteredResources = activeFilter === "All" 
    ? resources 
    : resources.filter(r => r.type === activeFilter);

  return (
    <div className="learn-page">
      <Navbar />

      <div className="learn-container">
        
        {/* --- HERO SECTION --- */}
        <div className="learn-hero">
            <div className="hero-content">
                <span className="hero-badge">Featured Course</span>
                <h1 className="hero-title">From Zero to Hero: The Complete Guide</h1>
                <p className="hero-desc">
                    Join 5,000+ photographers in our comprehensive 4-week bootcamp. 
                    Master your camera, understand light, and edit like a pro.
                </p>
                <button className="btn-hero">Start Watching Now</button>
            </div>
        </div>

        {/* --- SECTION TITLE & FILTERS --- */}
        <div className="mb-8">
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
                Browse Library
            </h2>
            
            <div className="filter-bar">
                {filters.map(filter => (
                    <button 
                        key={filter}
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="resources-grid">
            {filteredResources.map((resource) => (
                <div key={resource.id} className="resource-card">
                    
                    {/* Thumbnail Image */}
                    <div className="card-thumbnail">
                        <img src={resource.image} alt={resource.title} loading="lazy" />
                    </div>

                    <div className="card-body">
                        <div className="card-meta">
                            <span className="level-badge">{resource.category.toUpperCase()}</span>
                            <span>⏱ {resource.duration}</span>
                        </div>
                        
                        <h3 className="card-title">{resource.title}</h3>
                        <p className="card-description">{resource.description}</p>
                        
                        <button className="btn-start">
                            View Lesson
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State Check */}
        {filteredResources.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#71717a' }}>
                <p>No resources found for this category yet.</p>
            </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Learn;