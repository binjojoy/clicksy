// src/pages/SavedPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { 
  Heart, MapPin, Star, ArrowUpRight, Trash2, Search, Ghost
} from "lucide-react";
import "../styles/SavedPage.css";

const SavedPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Mock Data representing previously saved photographers
  // In a real app, this would be fetched from an API endpoint like /api/v1/user/saved
  const [savedItems, setSavedItems] = useState([
    { id: 101, name: "Elena Fisher", category: "Wedding", rating: 4.9, location: "Kochi", price: "₹15k/day", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
    { id: 103, name: "LensCrafters Studio", category: "Product", rating: 5.0, location: "Mumbai", price: "₹25k/project", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
    { id: 104, name: "Sarah Jenkins", category: "Fashion", rating: 4.8, location: "Delhi", price: "₹20k/day", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
  ]);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Function to handle removing an item from the saved list
  const handleUnsave = (id, name) => {
    // In a real app, make an API call here to delete the saved record
    // await axios.delete(`/api/v1/user/saved/${id}`);
    
    // Update UI state
    setSavedItems(prevItems => prevItems.filter(item => item.id !== id));
    console.log(`Unsaved ${name}`);
    // Optional: Show a toast notification here
  };

  if (loading) {
    return <div className="page-container bg-black center-content"><Navbar /><p className="text-muted">Loading your shortlist...</p></div>;
  }

  return (
    <div className="page-container bg-black">
      <Navbar />

      <main className="saved-main">
        <div className="content-wrapper">
            
            {/* --- HEADER SECTION --- */}
            <section className="saved-header">
                <div>
                    <h1 className="gradient-title">Your Shortlist</h1>
                    <p className="text-muted">Keep track of your favorite professionals.</p>
                </div>
                <div className="saved-count-badge">
                    {savedItems.length} Saved
                </div>
            </section>

            {/* --- SAVED GRID OR EMPTY STATE --- */}
            {savedItems.length > 0 ? (
                <div className="saved-grid">
                    {savedItems.map(item => (
                        <div key={item.id} className="saved-card">
                            {/* Image Header */}
                            <div className="saved-card-img" onClick={() => navigate(`/profile/${item.id}`)}>
                                <img src={item.image} alt={item.name} />
                                <div className="category-badge">{item.category}</div>
                            </div>

                            {/* Content Body */}
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

                                {/* Action Buttons */}
                                <div className="saved-actions">
                                    <button 
                                        className="btn-unsave" 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent navigating to profile
                                            handleUnsave(item.id, item.name);
                                        }}
                                        title="Remove from Saved"
                                    >
                                        <Heart size={18} fill="#ec4899" color="#ec4899" /> {/* Filled Heart icon */}
                                    </button>
                                    <button className="btn-view-profile-large" onClick={() => navigate(`/profile/${item.id}`)}>
                                        View Profile & Book <ArrowUpRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- EMPTY STATE --- */
                <div className="empty-saved-state">
                    <div className="empty-icon-wrapper">
                        <Ghost size={64} className="text-purple" />
                    </div>
                    <h2>Your shortlist is empty.</h2>
                    <p>Start exploring and save photographers you love to keep them handy.</p>
                    <button className="btn-explore-now" onClick={() => navigate('/explore')}>
                        <Search size={18} /> Explore Photographers
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