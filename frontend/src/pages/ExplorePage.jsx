// src/pages/ExplorePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Search, MapPin, Filter, Star, Heart, ArrowUpRight, Camera, Sparkles, ShieldCheck, CheckCircle, Clock
} from "lucide-react";
import "./ExplorePage.css";

const API_BASE_URL = 'http://localhost:5000/api/v1';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [photographers, setPhotographers] = useState([]);
  const [featuredWorks, setFeaturedWorks] = useState([]);

  // --- MOCK DATA EXPANDED ---
  const MOCK_PHOTOGRAPHERS = [
    { id: 101, name: "Elena Fisher", category: "Wedding", rating: 4.9, location: "Kochi, Kerala", price: "₹15,000/day", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    { id: 102, name: "Arjun Kapoor", category: "Portrait", rating: 4.7, location: "Bangalore", price: "₹8,000/session", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    { id: 103, name: "LensCrafters", category: "Product", rating: 5.0, location: "Mumbai", price: "₹25,000/project", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { id: 104, name: "Sarah Jenkins", category: "Fashion", rating: 4.8, location: "Delhi", price: "₹20,000/day", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
    { id: 105, name: "David Chen", category: "Events", rating: 4.6, location: "Chennai", price: "₹12,000/event", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  ];

  const MOCK_WORKS = [
    { id: 201, title: "Golden Hour Bride", photographer: "Elena Fisher", image: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&q=80&w=600" },
    { id: 202, title: "Neon Portraits", photographer: "Arjun Kapoor", image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=600" },
    { id: 203, title: "Minimalist Product", photographer: "LensCrafters", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600" },
    { id: 204, title: "Urban Street", photographer: "David Chen", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=600" },
  ];

  const MOCK_COLLECTIONS = [
    { id: 1, title: "Budget Friendly", subtitle: "Top talent under ₹10k", color: "from-green-500 to-emerald-700", image: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "The Wedding Edit", subtitle: "For your big day", color: "from-pink-500 to-rose-700", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Corporate Headshots", subtitle: "Look professional", color: "from-blue-500 to-indigo-700", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400" },
  ];

  const MOCK_LOCATIONS = [
    { name: "Kochi", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=150" },
    { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=150" },
    { name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=150" },
    { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=150" },
    { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=150" },
  ];

  const categories = ["All", "Wedding", "Portrait", "Fashion", "Product", "Events", "Travel"];

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      // Placeholder for backend connection
      setPhotographers(MOCK_PHOTOGRAPHERS);
      setFeaturedWorks(MOCK_WORKS);
    } catch (error) {
      console.warn("Using Mock Data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotographers = photographers.filter(pg => {
    const matchesSearch = pg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pg.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || pg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container bg-black">
      <Navbar />

      <main className="explore-main">
        {/* --- HERO SECTION --- */}
        <section className="explore-hero">
          <div className="hero-content">
            <div className="hero-badge">
                <Sparkles size={14} className="text-yellow-400" /> 
                <span>Discover Top Talent</span>
            </div>
            <h1>Find the perfect lens for your story.</h1>
            <p>Connect with verified professionals, browse portfolios, and book instantly.</p>
            
            <div className="hero-search-bar">
              <Search className="search-icon" size={22} />
              <input 
                type="text" 
                placeholder="Search 'Wedding in Kochi' or 'Portrait'..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn-search">Search</button>
            </div>
          </div>
          <div className="hero-overlay"></div>
        </section>

        <div className="explore-content-wrapper">
            
            {/* --- SECTION 1: POPULAR LOCATIONS (Story Bubbles) --- */}
            <section className="locations-section">
                <h3 className="section-label">Popular Locations</h3>
                <div className="locations-scroll">
                    {MOCK_LOCATIONS.map((loc, index) => (
                        <div key={index} className="location-bubble" onClick={() => setSearchTerm(loc.name)}>
                            <div className="bubble-img">
                                <img src={loc.image} alt={loc.name} />
                            </div>
                            <span>{loc.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- FILTER BAR --- */}
            <section className="filter-section">
                <div className="filter-scroll">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className="btn-filter-advanced"><Filter size={16} /> Filters</button>
            </section>

            {/* --- SECTION 2: PHOTOGRAPHERS GRID --- */}
            <section className="grid-section">
                <div className="section-header">
                    <h3>{activeCategory === "All" ? "Trending Photographers" : `${activeCategory} Photographers`}</h3>
                    <span className="result-count">{filteredPhotographers.length} results</span>
                </div>

                {filteredPhotographers.length === 0 ? (
                    <div className="empty-state">
                        <Camera size={48} />
                        <p>No photographers found matching your search.</p>
                        <button onClick={() => {setSearchTerm(""); setActiveCategory("All");}}>Clear Filters</button>
                    </div>
                ) : (
                    <div className="photographer-grid-lg">
                        {filteredPhotographers.map(pg => (
                            <div key={pg.id} className="pg-card-lg" onClick={() => navigate(`/profile/${pg.id}`)}>
                                <div className="pg-card-image">
                                    <img src={pg.image} alt={pg.name} />
                                    <div className="pg-card-overlay">
                                        <button className="btn-heart"><Heart size={18} /></button>
                                        <div className="pg-overlay-bottom">
                                            <span className="pg-price-tag">{pg.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pg-card-content">
                                    <div className="pg-header-row">
                                        <h4>{pg.name}</h4>
                                        <div className="pg-rating">
                                            <Star size={14} fill="#eab308" color="#eab308"/> 
                                            <span>{pg.rating}</span>
                                        </div>
                                    </div>
                                    <div className="pg-meta-row">
                                        <span className="pg-badge">{pg.category}</span>
                                        <span className="pg-location"><MapPin size={12}/> {pg.location}</span>
                                    </div>
                                    <button className="btn-view-profile">
                                        View Profile <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- SECTION 3: CURATED COLLECTIONS --- */}
            <section className="collections-section">
                <div className="section-header">
                    <h3>Curated Collections</h3>
                    <p className="text-muted">Handpicked lists for every occasion</p>
                </div>
                <div className="collections-grid">
                    {MOCK_COLLECTIONS.map(col => (
                        <div key={col.id} className="collection-card">
                            <img src={col.image} alt={col.title} className="col-bg" />
                            <div className="col-overlay">
                                <div>
                                    <h5>{col.title}</h5>
                                    <p>{col.subtitle}</p>
                                </div>
                                <ArrowUpRight className="col-icon" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TRUST STRIP --- */}
            <section className="trust-strip">
                <div className="trust-item">
                    <ShieldCheck size={24} className="text-purple" />
                    <div>
                        <h4>Verified Pros</h4>
                        <p>Identity checked & reviewed</p>
                    </div>
                </div>
                <div className="trust-item">
                    <CheckCircle size={24} className="text-purple" />
                    <div>
                        <h4>Secure Booking</h4>
                        <p>Your payment is protected</p>
                    </div>
                </div>
                <div className="trust-item">
                    <Clock size={24} className="text-purple" />
                    <div>
                        <h4>Fast Response</h4>
                        <p>Most pros reply in 2 hours</p>
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: INSPIRATION FEED --- */}
            <section className="inspiration-section">
                <div className="section-header">
                    <h3>Visual Inspiration</h3>
                    <p className="text-muted">Featured shots from our community</p>
                </div>
                
                <div className="masonry-grid">
                    {featuredWorks.map(work => (
                        <div key={work.id} className="work-card">
                            <img src={work.image} alt={work.title} loading="lazy" />
                            <div className="work-overlay">
                                <h5>{work.title}</h5>
                                <p>by {work.photographer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;