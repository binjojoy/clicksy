import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { supabase } from '../services/supabaseClient';
import '../styles/ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);

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

  // --- IN-APP MESSAGING CONTACT LOGIC ---
  const handleContact = async () => {
    if (!item || contactLoading) return;

    try {
      setContactLoading(true);

      // 1. Check if user is logged in (localStorage-based auth)
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        navigate('/auth');
        return;
      }

      // 2. Guard: can't message your own listing
      if (String(userId).trim() === String(item.user_id).trim()) {
        alert('This is your own listing');
        return;
      }

      // 3. Check for existing thread
      const { data: existingThread, error: threadError } = await supabase
        .from('listing_threads')
        .select('id')
        .eq('listing_id', item.id)
        .eq('buyer_id', userId)
        .maybeSingle();

      if (threadError) throw threadError;

      if (existingThread) {
        // Thread exists — navigate to it
        navigate(`/messages/${existingThread.id}`);
        return;
      }

      // 4. Create new thread
      const { data: newThread, error: insertError } = await supabase
        .from('listing_threads')
        .insert({
          listing_id: item.id,
          buyer_id: userId,
          seller_id: item.user_id,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      navigate(`/messages/${newThread.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(`Could not start conversation: ${error.message || error}`);
    } finally {
      setContactLoading(false);
    }
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
              <button 
                onClick={handleContact} 
                className="btn-primary-action full-width"
                disabled={contactLoading}
                style={{ opacity: contactLoading ? 0.7 : 1 }}
              >
                {contactLoading 
                  ? 'Opening chat...' 
                  : (item.listing_type === 'For Sale' ? 'Contact Seller' : 'Request Booking')
                }
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