import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { supabase } from '../services/supabaseClient'; 
import api from '../services/api';
import { toast } from "../components/Toaster.jsx";
import { ArrowLeft, Loader, Heart, ShieldCheck } from 'lucide-react';

const CategoryGallery = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Appreciation States
  const [appreciatedIds, setAppreciatedIds] = useState([]);
  const [appreciationCounts, setAppreciationCounts] = useState({});
  const [animatingHearts, setAnimatingHearts] = useState({}); // Tracking pulse animations
  const [sparkles, setSparkles] = useState({}); // Tracking sparkle bursts
  
  const userId = localStorage.getItem('user_id');
  const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    fetchCategoryPhotos();
  }, [category]);

  const fetchCategoryPhotos = async () => {
    try {
      setLoading(true);
      // Enrich portfolio endpoint to include photographer info
      const { data, error } = await supabase
        .from('portfolio_items')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url,
                is_verified,
                user_id
            )
        `)
        .ilike('category', category) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);

      if (data && data.length > 0) {
        const itemIds = data.map(p => p.id);
        
        // Parallel requests for counts and user appreciates
        const promises = [
            api.post('/appreciations/counts/batch', { portfolio_item_ids: itemIds })
                .then(res => setAppreciationCounts(res.data))
                .catch(err => console.error("Counts error:", err))
        ];

        if (userId) {
            promises.push(
                api.get(`/appreciations/user/${userId}`)
                    .then(res => setAppreciatedIds(res.data))
                    .catch(err => console.error("User apprec error:", err))
            );
        }

        await Promise.all(promises);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppreciate = async (e, photo) => {
    e.stopPropagation();
    if (!userId) return toast.error("Please login to appreciate.");
    
    // Cannot appreciate own work
    if (userId === photo.profiles?.user_id) return;

    const isAppreciated = appreciatedIds.includes(photo.id);

    // Optimistic UI
    if (isAppreciated) {
      // Un-appreciate
      setAnimatingHearts(prev => ({ ...prev, [photo.id]: 'shrink' }));
      setAppreciatedIds(prev => prev.filter(id => id !== photo.id));
      setAppreciationCounts(prev => ({ ...prev, [photo.id]: Math.max(0, (prev[photo.id] || 1) - 1) }));
      
      try {
        await api.delete(`/appreciations/${userId}/${photo.id}`);
        toast.success("Removed appreciation.");
      } catch (err) {
        // Revert
        setAppreciatedIds(prev => [...prev, photo.id]);
        setAppreciationCounts(prev => ({ ...prev, [photo.id]: (prev[photo.id] || 0) + 1 }));
        toast.error("Something went wrong.");
      }
    } else {
      // Appreciate
      setAnimatingHearts(prev => ({ ...prev, [photo.id]: 'pulse' }));
      setSparkles(prev => ({ ...prev, [photo.id]: true }));
      setAppreciatedIds(prev => [...prev, photo.id]);
      setAppreciationCounts(prev => ({ ...prev, [photo.id]: (prev[photo.id] || 0) + 1 }));
      
      setTimeout(() => setSparkles(prev => ({ ...prev, [photo.id]: false })), 500);

      try {
        await api.post('/appreciations', {
            appreciator_id: userId,
            portfolio_item_id: photo.id,
            photographer_id: photo.profiles?.user_id
        });
        toast.success("✨ Appreciated!");
      } catch (err) {
        if (err.response?.status !== 409) {
            setAppreciatedIds(prev => prev.filter(id => id !== photo.id));
            setAppreciationCounts(prev => ({ ...prev, [photo.id]: Math.max(0, (prev[photo.id] || 1) - 1) }));
            toast.error("Something went wrong.");
        }
      }
    }

    // Reset animation token after transition
    setTimeout(() => {
        setAnimatingHearts(prev => {
            const copy = { ...prev };
            delete copy[photo.id];
            return copy;
        });
    }, 350);
  };

  // Sparkle generator inner component
  const SparkleParticles = ({rot}) => (
    Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
            position: 'absolute',
            width: '4px', height: '4px',
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? '#a855f7' : '#ec4899',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-20px)`,
            opacity: 0,
            animation: 'sparkleAnim 0.5s ease-out forwards',
            '--rot': `${i * 72}deg`
        }} />
    ))
  );

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      
      {/* Dynamic Keyframes injected into head for animations */}
      <style>{`
        @keyframes pulseHeart {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
        @keyframes shrinkHeart {
            0% { transform: scale(1); }
            50% { transform: scale(0.7); }
            100% { transform: scale(1); }
        }
        @keyframes sparkleAnim {
            0% { transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(0) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) translateY(-30px) scale(0); opacity: 0; }
        }
        
        .gallery-card {
            border-radius: 0.75rem; 
            overflow: hidden; 
            border: 1px solid #27272a; 
            position: relative; 
            aspect-ratio: 1/1;
        }
        .gallery-card img {
            width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease;
        }
        .gallery-card:hover img {
            transform: scale(1.05);
        }
        
        /* The Identity Reveal Overlay */
        .identity-overlay {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 40%;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.75) 60%, transparent 100%);
            backdrop-filter: blur(2px);
            transform: translateY(100%);
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            padding: 16px;
            pointer-events: none;
            z-index: 2;
        }
        .gallery-card:hover .identity-overlay {
            transform: translateY(0);
            pointer-events: auto;
        }
        
        /* The Title */
        .card-title-overlay {
            position: absolute; 
            bottom: 0px; left: 0; right: 0;
            padding: 1rem;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            transition: transform 0.35s ease;
            z-index: 3;
            pointer-events: none;
        }
        .gallery-card:hover .card-title-overlay {
            transform: translateY(-8px);
        }

        /* Appreciate Button Base */
        .btn-appreciate {
            position: absolute;
            top: 12px;
            right: 12px;
            border-radius: 999px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            z-index: 4;
            transition: all 0.2s ease;
        }
        .btn-appreciate.default {
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: white;
        }
        .btn-appreciate.default:hover {
            background: rgba(124, 58, 237, 0.45);
            transform: scale(1.05);
        }
        .btn-appreciate.default:hover svg {
            color: #c4b5fd;
        }
        .btn-appreciate.active {
            background: rgba(124, 58, 237, 0.75);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(167, 139, 250, 0.4);
            color: white;
        }
        
        .anim-pulse svg { animation: pulseHeart 0.3s ease; }
        .anim-shrink svg { animation: shrinkHeart 0.25s ease; }
      `}</style>

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

        {/* The Photo Grid */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem' 
        }}>
            {photos.map((photo) => {
                const photographer = photo.profiles;
                const isOwnPhoto = userId && photographer?.user_id === userId;
                const isAppreciated = appreciatedIds.includes(photo.id);
                const count = appreciationCounts[photo.id] || 0;
                const animState = animatingHearts[photo.id] || '';
                const showSparkles = sparkles[photo.id];

                return (
                <div key={photo.id} className="gallery-card">
                    <img src={photo.media_url} alt={photo.title} />
                    
                    {/* Appreciate Button (Top Right) */}
                    {!isOwnPhoto && (
                        <button 
                            className={`btn-appreciate ${isAppreciated ? 'active' : 'default'} ${animState ? 'anim-' + animState : ''}`}
                            onClick={(e) => handleAppreciate(e, photo)}
                        >
                            <Heart size={16} 
                                fill={isAppreciated ? "#f43f5e" : "none"} 
                                color={isAppreciated ? "#f43f5e" : "currentColor"} 
                            />
                            <span style={{ fontSize: '0.8rem' }}>{count}</span>
                            {showSparkles && <SparkleParticles />}
                        </button>
                    )}

                    {/* Minimal Overlay for Title (Bottom Left) */}
                    <div className="card-title-overlay">
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'white' }}>{photo.title}</h3>
                    </div>

                    {/* Card Hover: Photographer Identity Reveal Overlay */}
                    {photographer && (
                        <div className="identity-overlay">
                            {/* Left Side */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img 
                                    src={photographer.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                                    alt={photographer.full_name}
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #7C3AED', marginRight: '10px' }}
                                />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                                            {photographer.full_name || "Anonymous"}
                                        </span>
                                        {photographer.is_verified && (
                                            <ShieldCheck size={14} color="#a78bfa" style={{ marginLeft: '4px' }} />
                                        )}
                                    </div>
                                    <div style={{ marginTop: '2px' }}>
                                        <span style={{ 
                                            background: 'rgba(124, 58, 237, 0.4)', 
                                            border: '1px solid rgba(167, 139, 250, 0.3)',
                                            color: '#c4b5fd',
                                            fontSize: '0.7rem',
                                            padding: '2px 8px',
                                            borderRadius: '999px',
                                            display: 'inline-block'
                                        }}>
                                            {photo.category || "General"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side */}
                            <div style={{ marginLeft: 'auto' }}>
                                <span 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        navigate(`/profile/${photographer.user_id}`); 
                                    }}
                                    style={{ fontSize: '0.75rem', color: '#a78bfa', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.textDecoration = 'underline'; }}
                                    onMouseLeave={e => { e.target.style.color = '#a78bfa'; e.target.style.textDecoration = 'none'; }}
                                >
                                    View Profile &rarr;
                                </span>
                            </div>
                        </div>
                    )}

                </div>
                );
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryGallery;