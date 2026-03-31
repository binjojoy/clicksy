import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api.js"; // Your axios instance
import { Heart, MapPin, Star, ArrowUpRight, Search, Ghost, Loader2 } from "lucide-react";
import "../styles/SavedPage.css";

const SavedPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [savedItems, setSavedItems] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetchSavedItems();
    }, []);

    const fetchSavedItems = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/saved/${userId}`);
            setSavedItems(data);
        } catch (error) {
            console.error("Error loading shortlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (id) => {
        try {
            // Optimistic Update
            setSavedItems(prev => prev.filter(item => item.id !== id));
            await api.delete(`/saved/${userId}/${id}`);
        } catch (error) {
            console.error("Failed to unsave:", error);
            fetchSavedItems(); // Rollback on error
        }
    };

    if (loading) {
        return (
            <div className="page-container bg-black center-content">
                <Navbar />
                <div className="loading-state">
                    <Loader2 className="animate-spin text-purple" size={40} />
                    <p className="text-muted mt-4">Syncing your shortlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-black">
            <Navbar />
            <main className="saved-main">
                <div className="content-wrapper">
                    <section className="saved-header">
                        <div>
                            <h1 className="gradient-title">Your Shortlist</h1>
                            <p className="text-muted">Keep track of your favorite professionals.</p>
                        </div>
                        <div className="saved-count-badge">
                            {savedItems.length} {savedItems.length === 1 ? 'Item' : 'Items'}
                        </div>
                    </section>

                    {savedItems.length > 0 ? (
                        <div className="saved-grid">
                            {savedItems.map(item => (
                                <div key={item.id} className="saved-card glass-morphism">
                                    <div className="saved-card-img" onClick={() => navigate(`/profile/${item.id}`)}>
                                        <img src={item.image} alt={item.name} />
                                        <div className="category-badge">{item.category}</div>
                                    </div>

                                    <div className="saved-card-content">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 onClick={() => navigate(`/profile/${item.id}`)}>{item.name}</h3>
                                            <div className="rating-pill">
                                                <Star size={12} fill="#eab308" color="#eab308"/> 
                                                <span>{item.rating}</span>
                                            </div>
                                        </div>

                                        <div className="meta-details">
                                            <p className="flex items-center gap-1"><MapPin size={14} className="text-muted"/> {item.location}</p>
                                            <p className="price-highlight">{item.price}</p>
                                        </div>

                                        <div className="saved-actions">
                                            <button 
                                                className="btn-unsave" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnsave(item.id);
                                                }}
                                            >
                                                <Heart size={18} fill="#ec4899" color="#ec4899" />
                                            </button>
                                            <button className="btn-view-profile-large" onClick={() => navigate(`/profile/${item.id}`)}>
                                                Book Now <ArrowUpRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-saved-state glass-morphism">
                            <div className="empty-icon-wrapper">
                                <Ghost size={64} className="text-purple" />
                            </div>
                            <h2>Your shortlist is empty.</h2>
                            <p>Explore photographers and click the heart to save them.</p>
                            <button className="btn-explore-now" onClick={() => navigate('/explore')}>
                                <Search size={18} /> Explore Now
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SavedPage;