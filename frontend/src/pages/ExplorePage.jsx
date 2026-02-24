import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Search, MapPin, Filter, Star, Heart, ArrowUpRight, Camera, Sparkles, 
  ShieldCheck, CheckCircle, Clock, X 
} from "lucide-react";
import "../styles/ExplorePage.css";

const API_BASE_URL = 'http://localhost:5000/api/v1';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Data States
  const [photographers, setPhotographers] = useState([]);
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [locations, setLocations] = useState([]); 
  const [collections, setCollections] = useState([]); 
  
  // Modal/Overlay States
  const [selectedLocation, setSelectedLocation] = useState(null); 
  const [activeCollection, setActiveCollection] = useState(null); 

  const categories = ["All", "Wedding", "Portrait", "Fashion", "Product", "Events", "Travel"];

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    setLoading(true);
    try {
      // 1. Fetch main data
      const [pgRes, locRes, colRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/profile/explore/photographers`),
        axios.get(`${API_BASE_URL}/profile/explore/locations`),
        axios.get(`${API_BASE_URL}/profile/explore/collections`).catch(() => ({ data: [] }))
      ]);

      // Photographers Mapping
      setPhotographers(pgRes.data.map(p => ({
        id: p.user_id,
        name: p.full_name || "New Photographer",
        category: (p.skills && p.skills.length > 0) ? p.skills[0] : "General",
        location: p.location || "Location Private",
        hourly_rate: p.hourly_rate || 0,
        skills: p.skills || [],
        price: p.hourly_rate ? `₹${p.hourly_rate}/hr` : "Contact",
        image: p.avatar_url || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
        rating: 4.9
      })));

      setLocations(locRes.data || []);
      setCollections(colRes.data || []);

      // 2. Fetch Inspiration (Isolated)
      const worksRes = await axios.get(`${API_BASE_URL}/profile/explore/inspiration`);
      console.log("Inspiration Data Received:", worksRes.data); 
      setFeaturedWorks(worksRes.data || []);

    } catch (err) {
      console.error("Critical Data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotographers = photographers.filter(pg => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = pg.name.toLowerCase().includes(term) || 
                          pg.location.toLowerCase().includes(term);
    const matchesCategory = activeCategory === "All" || 
                           (pg.category && pg.category.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const photographersInLocation = photographers.filter(pg => 
    selectedLocation && pg.location.toLowerCase() === selectedLocation.toLowerCase()
  );

  const photographersInCollection = photographers.filter(pg => {
    if (!activeCollection) return false;
    if (activeCollection.filter_type === 'skill') {
        return pg.skills.some(s => s.toLowerCase() === activeCollection.filter_value.toLowerCase());
    }
    if (activeCollection.filter_type === 'rate') {
        return pg.hourly_rate && pg.hourly_rate <= parseInt(activeCollection.filter_value);
    }
    return false;
  });

  const closeModals = () => {
    setSelectedLocation(null);
    setActiveCollection(null);
  };

  return (
    <div className={`page-container bg-black ${(selectedLocation || activeCollection) ? 'modal-open' : ''}`}>
      <Navbar />

      {/* GLASSMORPHISM MODAL */}
      {(selectedLocation || activeCollection) && (
        <div className="location-overlay-backdrop" onClick={closeModals}>
          <div className="location-glass-container" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-glass" onClick={closeModals}><X size={20} /></button>
            <div className="glass-header">
                <h2>{selectedLocation ? `Photographers in ${selectedLocation}` : activeCollection.title}</h2>
                <p className="text-muted">
                    {selectedLocation ? photographersInLocation.length : photographersInCollection.length} professionals found
                </p>
            </div>
            <div className="glass-content-grid">
              {(selectedLocation ? photographersInLocation : photographersInCollection).map(pg => (
                <div key={pg.id} className="pg-card-sm" onClick={() => navigate(`/profile/${pg.id}`)}>
                  <div className="pg-sm-img-wrapper"><img src={pg.image} alt={pg.name} /></div>
                  <div className="pg-sm-details">
                    <h5>{pg.name}</h5>
                    <span className="pg-sm-cat">{pg.category}</span>
                    <ArrowUpRight size={14} className="arrow-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="explore-main">
        <section className="explore-hero">
          <div className="hero-content">
            <div className="hero-badge"><Sparkles size={14} className="text-yellow-400" /> <span>Discover Top Talent</span></div>
            <h1>Find the perfect lens for your story.</h1>
            <div className="hero-search-bar">
              <Search className="search-icon" size={22} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="btn-search">Search</button>
            </div>
          </div>
          <div className="hero-overlay"></div>
        </section>

        <div className="explore-content-wrapper">
            <section className="locations-section">
                <h3 className="section-label">Popular Locations</h3>
                <div className="locations-scroll">
                    {locations.map((loc, index) => (
                        <div key={index} className="location-bubble dynamic" onClick={() => setSelectedLocation(loc.name)}>
                            <div className="bubble-icon-wrapper"><MapPin size={24} /></div>
                            <div className="bubble-text"><span className="loc-name">{loc.name}</span><span className="loc-count">{loc.count} Pros</span></div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="filter-section">
                <div className="filter-scroll">
                    {categories.map(cat => (
                        <button key={cat} className={`filter-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                    ))}
                </div>
            </section>

            <section className="grid-section">
                <div className="section-header">
                    <h3>{activeCategory === "All" ? "Trending Photographers" : `${activeCategory} Photographers`}</h3>
                    <span className="result-count">{filteredPhotographers.length} results</span>
                </div>
                {filteredPhotographers.length === 0 && !loading ? (
                    <div className="empty-state"><Camera size={48} /><p>No photographers found.</p></div>
                ) : (
                    <div className="photographer-grid-lg">
                        {filteredPhotographers.map(pg => (
                            <div key={pg.id} className="pg-card-lg" onClick={() => navigate(`/profile/${pg.id}`)}>
                                <div className="pg-card-image">
                                    <img src={pg.image} alt={pg.name} />
                                    <div className="pg-card-overlay">
                                        <button className="btn-heart" onClick={(e) => e.stopPropagation()}><Heart size={18} /></button>
                                        <div className="pg-overlay-bottom"><span className="pg-price-tag">{pg.price}</span></div>
                                    </div>
                                </div>
                                <div className="pg-card-content">
                                    <div className="pg-header-row"><h4>{pg.name}</h4><div className="pg-rating"><Star size={14} fill="#eab308" color="#eab308"/> <span>{pg.rating}</span></div></div>
                                    <div className="pg-meta-row"><span className="pg-badge">{pg.category}</span><span className="pg-location"><MapPin size={12}/> {pg.location}</span></div>
                                    <button className="btn-view-profile">View Profile <ArrowUpRight size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="collections-section">
                <div className="section-header"><h3>Curated Collections</h3></div>
                <div className="collections-grid">
                    {collections.map(col => (
                        <div key={col.id} className="collection-card" onClick={() => setActiveCollection(col)}>
                            <img src={col.image_url} alt={col.title} className="col-bg" />
                            <div className="col-overlay"><div><h5>{col.title}</h5><p>{col.subtitle}</p></div><ArrowUpRight className="col-icon" /></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- RE-ADDED VISUAL INSPIRATION FEED --- */}
            <section className="inspiration-section">
                <div className="section-header">
                    <h3>Visual Inspiration</h3>
                </div>
                <div className="masonry-grid">
                    {featuredWorks.map(work => (
                        <div key={work.id} className="work-card">
                            <img src={work.image_url} alt={work.title} loading="lazy" />
                            <div className="work-overlay">
                                <h5>{work.title}</h5>
                                <p>by {work.photographer_name}</p>
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