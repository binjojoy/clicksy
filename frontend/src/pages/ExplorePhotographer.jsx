import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { toast } from "../components/Toaster.jsx";
import {
  Search, MapPin, Star, UserPlus, ArrowUpRight, Camera, Sparkles, X
} from "lucide-react";
import AvatarFallback from "../components/AvatarFallback.jsx";
import "../styles/ExplorePage.css";

const API_BASE_URL = 'http://localhost:5000/api/v1';

const ExplorePhotographer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Data States
  const [photographers, setPhotographers] = useState([]);
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [collections, setCollections] = useState([]);
  const [connectedIds, setConnectedIds] = useState([]); // Tracks user's connected list

  // Modal/Overlay States
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);

  const userId = localStorage.getItem("user_id");
  const categories = ["All", "Wedding", "Portrait", "Fashion", "Product", "Events", "Travel"];

  useEffect(() => {
    fetchExploreData();
    if (userId) {
      fetchConnectedList();
    }
  }, [userId]);

  const fetchConnectedList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${userId}/following`);
      setConnectedIds(res.data.map(item => item.id));
    } catch (err) {
      console.error("Error fetching connected list:", err);
    }
  };

  const toggleConnect = async (e, photographerId) => {
    e.stopPropagation();
    if (!userId) return toast.error("Please login to connect.");

    const isCurrentlyConnected = connectedIds.includes(photographerId);

    // Optimistic Update
    if (isCurrentlyConnected) {
      setConnectedIds(prev => prev.filter(id => id !== photographerId));
    } else {
      setConnectedIds(prev => [...prev, photographerId]);
    }

    try {
      // Use the proper explore follow toggle endpoint
      await axios.post(`${API_BASE_URL}/profile/${photographerId}/follow`, { userId });

      if (isCurrentlyConnected) {
        toast.success("Unfollowed.");
      } else {
        toast.success("Following request sent!");
      }
    } catch (err) {
      console.error("Connection error:", err);
      // Revert on error
      if (isCurrentlyConnected) {
        setConnectedIds(prev => [...prev, photographerId]);
      } else {
        setConnectedIds(prev => prev.filter(id => id !== photographerId));
      }
      toast.error("Failed to update connection.");
    }
  };

  const fetchExploreData = async () => {
    setLoading(true);
    try {
      const [pgRes, locRes, colRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/profile/explore/photographers`),
        axios.get(`${API_BASE_URL}/profile/explore/locations`),
        axios.get(`${API_BASE_URL}/profile/explore/collections`).catch(() => ({ data: [] }))
      ]);

      setPhotographers(
        pgRes.data
          .filter(p => !userId || String(p.user_id) !== String(userId))
          .map(p => ({
            id: p.user_id,
            name: p.full_name || "New Photographer",
            category: (p.skills && p.skills.length > 0) ? p.skills[0] : "General",
            location: p.location || "Location Private",
            image: p.avatar_url || null,
            rating: 4.9,
            skills: p.skills || []
          }))
      );

      setLocations(locRes.data || []);
      setCollections(colRes.data || []);

      const worksRes = await axios.get(`${API_BASE_URL}/profile/explore/inspiration`);
      setFeaturedWorks(worksRes.data || []);
    } catch (err) {
      console.error("Data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotographers = photographers.filter(pg => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = pg.name.toLowerCase().includes(term) ||
      pg.location.toLowerCase().includes(term) ||
      pg.category.toLowerCase().includes(term);
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
    return false;
  });

  const closeModals = () => {
    setSelectedLocation(null);
    setActiveCollection(null);
  };

  return (
    <div className={`page-container bg-black ${(selectedLocation || activeCollection) ? 'modal-open' : ''}`}>
      <Navbar />

      {/* GLASSMORPHISM OVERLAY MODAL */}
      {(selectedLocation || activeCollection) && (
        <div className="location-overlay-backdrop" onClick={closeModals}>
          <div className="location-glass-container" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-glass" onClick={closeModals}><X size={20} /></button>
            <div className="glass-header">
              <h2>{selectedLocation ? `Photographers in ${selectedLocation}` : activeCollection.title}</h2>
              <p>{selectedLocation ? photographersInLocation.length : photographersInCollection.length} professionals found</p>
            </div>
            <div className="glass-content-grid">
              {(selectedLocation ? photographersInLocation : photographersInCollection).map(pg => (
                <div key={pg.id} className="pg-card-sm" onClick={() => navigate(`/profile/${pg.id}`)}>
                  <div className="pg-sm-img-wrapper">
                    <AvatarFallback name={pg.name} imageUrl={pg.image} size="sm" />
                  </div>
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
        {/* HERO SECTION */}
        <section className="explore-hero" style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #0d0d0d 100%)',
          minHeight: '520px',
          padding: '100px 20px',
          position: 'relative'
        }}>
          <div className="hero-content" style={{ zIndex: 2, position: 'relative' }}>
            <div className="hero-badge" style={{ marginBottom: '24px' }}><Sparkles size={14} /> <span>GROW YOUR NETWORK</span></div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              lineHeight: '1.15',
              marginBottom: '36px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '150%',
                height: '200%',
                background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: -1
              }}></div>
              Connect with photographers who inspire you.
            </h1>
            <div className="hero-search-bar" style={{
              maxWidth: '680px',
              margin: '0 auto',
              borderRadius: '50px',
              boxShadow: '0 0 40px rgba(124,58,237,0.2)'
            }}>
              <Search className="search-icon" size={22} />
              <input type="text" placeholder="Search by name, style or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="btn-search">Search</button>
            </div>
          </div>
          <div className="hero-overlay" style={{ display: 'none' }}></div>
        </section>

        <div className="explore-content-wrapper">
          {/* POPULAR LOCATIONS */}
          <section className="locations-section">
            <h3 className="section-label">Popular Locations</h3>
            <div className="locations-scroll">
              {locations.map((loc, index) => (
                <div key={index} className="location-bubble dynamic" onClick={() => setSelectedLocation(loc.name)}>
                  <div className="bubble-icon-wrapper"><MapPin size={24} /></div>
                  <div className="bubble-text">
                    <span className="loc-name">{loc.name}</span>
                    <span className="loc-count">{loc.count} Pros</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CATEGORY FILTERS */}
          <section className="filter-section">
            <div className="filter-scroll">
              {categories.map(cat => (
                <button key={cat} className={`filter-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
          </section>

          {/* MAIN PHOTOGRAPHER GRID */}
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
                    <div 
                      className="pg-card-image"
                      style={!pg.image ? { background: 'linear-gradient(145deg, #1a1025, #2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' } : {}}
                    >
                      {pg.image ? (
                        <img src={pg.image} alt={pg.name} />
                      ) : (
                        <>
                          <Camera size={80} style={{ position: 'absolute', opacity: 0.06 }} />
                          <AvatarFallback name={pg.name} imageUrl={null} size="xl" style={{ position: 'relative', zIndex: 1 }} />
                        </>
                      )}
                      <div className="pg-card-overlay">
                        <div className="pg-overlay-top" style={{ justifyContent: 'flex-end', padding: '12px' }}>
                        </div>
                        <div className="pg-overlay-bottom">
                          <span className="pg-price-tag" style={{ background: '#7c3aed', color: '#fff' }}>{pg.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pg-card-content">
                      <div className="pg-header-row">
                        <h4>{pg.name}</h4>
                        <div className="pg-rating"><Star size={14} fill="#eab308" color="#eab308" /> <span>{pg.rating}</span></div>
                      </div>
                      <div className="pg-meta-row" style={{ marginBottom: '16px' }}>
                        <span className="pg-badge">{pg.category}</span>
                        <span className="pg-location"><MapPin size={12} /> {pg.location}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button
                          className={`btn-connect-network ${connectedIds.includes(pg.id) ? 'active' : ''}`}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: connectedIds.includes(pg.id) ? '#4C1D95' : '#7C3AED',
                            color: '#fff',
                            border: '1px solid transparent',
                            padding: '8px 0',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => toggleConnect(e, pg.id)}
                        >
                          <UserPlus size={16} />
                          {connectedIds.includes(pg.id) ? 'Connected \u2713' : 'Connect'}
                        </button>
                        <button
                          className="btn-view-profile"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            background: 'transparent',
                            color: '#fff',
                            border: '1px solid #7C3AED',
                            padding: '8px 0',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            margin: 0,
                            width: 'auto'
                          }}
                        >
                          View Profile <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CURATED COLLECTIONS */}
          <section className="collections-section">
            <div className="section-header"><h3>Curated Collections</h3></div>
            <div className="collections-grid">
              {collections.map(col => (
                <div key={col.id} className="collection-card" onClick={() => setActiveCollection(col)}>
                  <img src={col.image_url} alt={col.title} className="col-bg" />
                  <div className="col-overlay">
                    <div><h5>{col.title}</h5><p>{col.subtitle}</p></div>
                    <ArrowUpRight className="col-icon" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* VISUAL INSPIRATION FEED */}
          <section className="inspiration-section">
            <div className="section-header"><h3>Visual Inspiration</h3></div>
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

export default ExplorePhotographer;
