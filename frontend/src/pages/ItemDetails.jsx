import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { supabase } from '../config/supabaseClient';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error('Error fetching details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- THE NEW CONTACT LOGIC ---
  const handleContact = () => {
    if (!item) return;

    // 1. Define the Seller's Email
    // ideally, you'd fetch this from the 'profiles' table using item.user_id.
    // For now, we use a placeholder or the user_id to simulate it.
    const sellerEmail = "seller@example.com"; 
    
    // 2. Create a professional Subject Line
    const subject = encodeURIComponent(`Inquiry regarding: ${item.name}`);
    
    // 3. Create a polite Body Message
    const body = encodeURIComponent(
      `Hi,\n\nI am interested in your listing for "${item.name}" listed on the Marketplace.\n\nIs it still available?\n\nBest regards,`
    );

    // 4. Open the User's Email Client
    window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
  };

  if (loading) return (
    <div className="details-loading">
      <Navbar />
      <div className="flex h-screen items-center justify-center text-gray-500">
          Loading details...
      </div>
    </div>
  );

  if (!item) return (
    <div className="details-loading">
        <Navbar />
        <div className="flex h-screen items-center justify-center text-gray-500">
            Item not found.
        </div>
    </div>
  );

  return (
    <div className="details-page">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20">
        
        <Link to="/marketplace" className="back-link">
           ← Back to Marketplace
        </Link>

        <div className="details-grid">
          
          {/* LEFT: Image */}
          <div className="details-image-container">
            <img 
              src={item.image_url || "https://via.placeholder.com/600x400?text=No+Image"} 
              alt={item.name} 
              className="details-image"
            />
            <div className={`details-badge ${item.listing_type === 'For Sale' ? 'bg-sale' : 'bg-rent'}`}>
               {item.listing_type === 'For Sale' ? 'FOR SALE' : 'FOR RENT'}
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="details-info">
            
            <h1 className="details-title">{item.name}</h1>
            
            <div className="details-price-row">
               <span className="details-price">
                 ${item.price.toLocaleString()}
                 {item.listing_type === 'For Rent' && item.rent_period && (
                   <span className="text-sm text-gray-400"> / {item.rent_period}</span>
                 )}
               </span>
               <span className="details-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                  </svg>
                  {item.location}
               </span>
            </div>

            <div className="divider"></div>

            <div className="description-box">
              <h3>Description</h3>
              <p>{item.description || "No description provided."}</p>
            </div>

            {/* --- SINGLE ACTION BUTTON --- */}
            <div className="details-actions">
              <button onClick={handleContact} className="btn-primary-action full-width">
                {item.listing_type === 'For Sale' ? 'Contact Seller' : 'Request Booking'}
              </button>
            </div>

            <div className="seller-info">
               <p className="text-sm text-gray-500">Seller ID: {item.user_id.substring(0,8)}...</p>
               <p className="text-xs text-gray-600 mt-1">Posted on: {new Date(item.created_at).toLocaleDateString()}</p>
            </div>

          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ItemDetails;