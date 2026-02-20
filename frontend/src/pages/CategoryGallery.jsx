import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { supabase } from '../services/supabaseClient'; 
import { ArrowLeft, Loader } from 'lucide-react';

const CategoryGallery = () => {
  const { category } = useParams(); // 1. Get "nature" from URL
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize first letter for display (nature -> Nature)
  const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    fetchCategoryPhotos();
  }, [category]);

  const fetchCategoryPhotos = async () => {
    try {
      setLoading(true);
      // 2. Fetch from Supabase filtering by Category
      // Note: We use ilike for case-insensitive matching (Nature == nature)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .ilike('category', category) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
        
        {/* Header with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', gap: '1rem' }}>
            <button 
                onClick={() => navigate('/portfolio')}
                style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{displayTitle} Collection</h1>
                <p style={{ color: '#6b7280' }}>Browse our finest {displayTitle.toLowerCase()} photography</p>
            </div>
        </div>

        {/* Loading State */}
        {loading && (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                 <Loader className="animate-spin" color="#7c3aed" size={40} />
             </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
             <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed #333', borderRadius: '1rem' }}>
                 <p style={{ fontSize: '1.2rem', color: '#9ca3af' }}>No photos found in this category yet.</p>
                 <button onClick={() => navigate('/upload-portfolio')} style={{ marginTop: '1rem', color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Upload the first one?
                 </button>
             </div>
        )}

        {/* The Photo Grid (Simple Masonry-ish Flex) */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem' 
        }}>
            {photos.map((photo) => (
                <div key={photo.id} style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #27272a', position: 'relative', aspectRatio: '1/1' }}>
                    <img 
                        src={photo.media_url} 
                        alt={photo.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    {/* Minimal Overlay for Title */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '1rem',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{photo.title}</h3>
                    </div>
                </div>
            ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default CategoryGallery;