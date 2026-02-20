import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { supabase } from '../services/supabaseClient'; 
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data);
    } catch (error) {
      console.error('Error fetching listings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (item) => {
    if (item.listing_type === 'For Rent' && item.rent_period) {
      return `$${item.price}/${item.rent_period}`;
    }
    return `$${item.price.toLocaleString()}`;
  };

  return (
    <div className="marketplace-page">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          
          {/* --- HEADER (Fixed Logo Color) --- */}
          <div className="text-center mb-12">
            <svg
              width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="mx-auto mb-4" 
              style={{ color: '#7c3aed' }} /* Explicit Purple Color */
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Equipment Marketplace
            </h1>
            <p className="text-xl text-gray-400">
              Buy, sell, or rent professional gear
            </p>
          </div>

          {loading ? (
             <div className="text-center text-white py-20">Loading marketplace...</div>
          ) : (
            <div className="marketplace-grid">
              {items.length === 0 ? (
                 <p className="text-center text-gray-400 col-span-full">No items listed yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="market-card">
                    
                    {/* Image Section */}
                    <div className="card-image-container">
                        <img 
                            src={item.image_url || "https://via.placeholder.com/400x300?text=No+Image"} 
                            alt={item.name} 
                            className="card-image"
                        />
                        {/* Badges */}
                        <span className={`badge-overlay ${item.listing_type === 'For Sale' ? 'bg-sale' : 'bg-rent'}`}>
                            {item.listing_type === 'For Sale' ? 'SALE' : 'RENT'}
                        </span>
                    </div>

                    {/* Content Section */}
                    <div className="card-content">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="item-name">{item.name}</h3>
                             <span className="item-price">
                                {formatPrice(item)}
                             </span>
                        </div>

                        <p className="item-location">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {item.location}
                        </p>

                        <Link to={`/marketplace/item/${item.id}`} className="btn-details">
                            View Details
                        </Link>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Floating Add Button */}
      <Link to="/marketplace/sell-item" className="fab-add-item" title="Sell Item">
        <svg className="fab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      <Footer />
    </div>
  );
};

export default Marketplace;