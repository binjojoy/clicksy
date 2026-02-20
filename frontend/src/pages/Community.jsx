import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { X, Sparkles, MapPin, UserPlus, Loader2 } from "lucide-react"; 
import api from '../services/api'; 
import '../styles/Community.css'; 

const Community = () => {
    // --- STATE ---
    const [showModal, setShowModal] = useState(false);
    
    // Feed State
    const [loading, setLoading] = useState(true);
    const [discussions, setDiscussions] = useState([]);
    
    // Recommendation State (The new Brains)
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(true);

    // Sidebar Inputs
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");

    // Comment State
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [replyText, setReplyText] = useState("");

    // --- HELPER: Get User ID ---
    const getCurrentUserId = () => {
        const userId = localStorage.getItem('user_id');
        return userId ? userId : null;
    };

    // --- HELPER: Match Color Logic ---
    const getMatchColor = (score) => {
        if (score >= 80) return "#10b981"; // Emerald Green
        if (score >= 50) return "#f59e0b"; // Amber
        return "#6b7280"; // Grey
    };

    // --- 1. FETCH DATA (Feed & Recommendations) ---
    useEffect(() => {
        const userId = getCurrentUserId();

        // A. Fetch Community Posts
        const fetchPosts = async () => {
            try {
                const res = await api.get(`/community/posts?userId=${userId || ''}`);
                setDiscussions(res.data);
            } catch (err) {
                console.error("Failed to load posts", err);
            } finally {
                setLoading(false);
            }
        };

        // B. Fetch Dynamic Recommendations (The New Algorithm)
        const fetchRecommendations = async () => {
            if (!userId) {
                setRecLoading(false);
                return;
            }
            try {
                const res = await api.get(`/recommendations/peers?userId=${userId}`);
                setRecommendations(res.data);
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setRecLoading(false);
            }
        };

        fetchPosts();
        fetchRecommendations();
    }, []);

    // --- ACTIONS ---

    // 2. CREATE POST
    const handleCreatePost = async () => {
        const userId = getCurrentUserId();
        if (!userId) return alert("Please log in to post.");
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        try {
            await api.post('/community/posts', {
                user_id: userId,
                title: newPostTitle,
                content: newPostContent,
                category: "General"
            });
            
            setNewPostTitle("");
            setNewPostContent("");
            // Refresh feed
            const res = await api.get(`/community/posts?userId=${userId}`);
            setDiscussions(res.data);
        } catch (err) {
            console.error("Error creating post", err);
            alert("Failed to create post.");
        }
    };

    // 3. LIKE POST
    const handleLike = async (id) => {
        const userId = getCurrentUserId();
        if (!userId) return alert("Please log in to like posts.");

        const post = discussions.find(p => p.id === id);
        const isCurrentlyLiked = post.hasLiked;

        // Optimistic UI Update
        setDiscussions(discussions.map(p => 
            p.id === id 
                ? { ...p, hasLiked: !isCurrentlyLiked, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 } 
                : p
        ));

        try {
            await api.put(`/community/posts/${id}/like`, { user_id: userId });
        } catch (err) {
            console.error("Like failed", err);
            // Revert if fail
            setDiscussions(discussions.map(p => 
                p.id === id ? { ...p, hasLiked: isCurrentlyLiked, likes: post.likes } : p
            ));
        }
    };

    const toggleComments = (id) => {
        setActiveCommentId(activeCommentId === id ? null : id);
    };

    // 4. SUBMIT REPLY
    const handleReplySubmit = async (postId) => {
        const userId = getCurrentUserId();
        const userName = localStorage.getItem('userName') || "You"; 

        if (!userId) return alert("Please log in to comment.");
        if (!replyText.trim()) return;

        const tempId = Date.now();
        const newComment = { id: tempId, user: userName, text: replyText };
        
        setDiscussions(discussions.map(p => 
            p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        ));
        setReplyText("");

        try {
            await api.post(`/community/posts/${postId}/comment`, {
                user_id: userId,
                content: newComment.text
            });
        } catch (err) {
            console.error("Reply failed", err);
        }
    };

    // 5. CONNECT ACTION
    const handleConnect = (id) => {
        // In a real app, this would call api.post('/connections', { targetId: id })
        alert(`Connection request sent!`);
    };

    return (
        <div className="community-page">
            <Navbar />

            <div className="community-container">
                
                {/* HEADER */}
                <div className="community-header">
                    <svg
                        width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="mx-auto mb-6" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 10px rgba(124,58,237,0.3))' }}
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <h1 className="header-title">The Photographer's Lounge</h1>
                    <p className="header-subtitle">Connect, critique, and grow together.</p>
                </div>

                {/* MAIN LAYOUT */}
                <div className="forum-grid">
                    
                    {/* LEFT: FEED */}
                    <div className="feed-section">
                        {loading ? (
                            <div style={{color: '#a1a1aa', textAlign: 'center', marginTop: '2rem'}}>Loading discussions...</div>
                        ) : (
                            discussions.map((discussion) => (
                                <div key={discussion.id} className="discussion-card">
                                    <div className="card-content-padding">
                                        <div className="card-top">
                                            <span className="category-badge">{discussion.category}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{discussion.time}</span>
                                        </div>
                                        <h3 className="discussion-title" onClick={() => toggleComments(discussion.id)}>
                                            {discussion.title}
                                        </h3>
                                        <div className="discussion-meta">
                                            <span style={{ color: 'white', fontWeight: '500' }}>@{discussion.author}</span>
                                            <button className={`meta-btn ${discussion.hasLiked ? 'liked' : ''}`} onClick={() => handleLike(discussion.id)}>
                                                <svg width="18" height="18" fill={discussion.hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                {discussion.likes}
                                            </button>
                                            <button className={`meta-btn ${activeCommentId === discussion.id ? 'active' : ''}`} onClick={() => toggleComments(discussion.id)}>
                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                {discussion.comments.length} Replies
                                            </button>
                                        </div>
                                    </div>
                                    {activeCommentId === discussion.id && (
                                        <div className="comments-section">
                                            <div className="reply-box">
                                                <input 
                                                    type="text" 
                                                    className="reply-input" 
                                                    placeholder="Write a reply..." 
                                                    value={replyText} 
                                                    onChange={(e) => setReplyText(e.target.value)} 
                                                    onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(discussion.id)}
                                                />
                                                <button className="btn-send" onClick={() => handleReplySubmit(discussion.id)}>Post</button>
                                            </div>
                                            <div className="comment-list">
                                                {discussion.comments.map(c => (
                                                    <div key={c.id} className="single-comment">
                                                        <div className="comment-avatar"></div>
                                                        <div className="comment-body"><span className="comment-author">{c.user}</span>{c.text}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* RIGHT: SIDEBAR */}
                    <div className="sidebar-section">
                        
                        {/* Widget 1: Create Post */}
                        <div className="sidebar-card mb-6">
                            <h3 className="sidebar-title">Start a Discussion</h3>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>Share your thoughts or ask for advice.</p>
                            
                            <input 
                                type="text" 
                                className="create-input" 
                                placeholder="Title..." 
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                            <textarea 
                                className="create-input" 
                                placeholder="Content..." 
                                rows="3" 
                                style={{ resize: 'none' }}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            ></textarea>
                            
                            <button className="btn-create-post" onClick={handleCreatePost}>Post to Forum</button>
                        </div>

                        {/* Widget 2: CLASSIC RECOMMENDATION WIDGET (NEW) */}
                        <div className="sidebar-card classic-rec-widget">
                            <div className="rec-header">
                                <Sparkles size={16} className="text-purple-400" />
                                <h3 className="sidebar-title">Top Matches</h3>
                            </div>
                            <p className="rec-subtitle">
                                Curated based on your skills & location.
                            </p>

                            <div className="classic-rec-list">
                                {recLoading ? (
                                    <div className="rec-loading"><Loader2 className="animate-spin" size={20}/></div>
                                ) : recommendations.length > 0 ? (
                                    recommendations.slice(0, 3).map((person) => (
                                        <div key={person.id} className="classic-rec-item">
                                            
                                            {/* Avatar with Match Ring */}
                                            <div className="rec-avatar-container">
                                                <div 
                                                    className="rec-match-ring" 
                                                    style={{ borderColor: getMatchColor(person.match) }}
                                                >
                                                    {person.avatar ? (
                                                        <img src={person.avatar} alt={person.name} />
                                                    ) : (
                                                        <div className="rec-placeholder">{person.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <span 
                                                    className="rec-score-pill" 
                                                    style={{ backgroundColor: getMatchColor(person.match) }}
                                                >
                                                    {person.match}%
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="rec-info">
                                                <h4 className="rec-name">{person.name}</h4>
                                                <span className="rec-role">{person.role}</span>
                                                <span className="rec-loc">
                                                    <MapPin size={10} /> {person.location}
                                                </span>
                                            </div>

                                            {/* Connect */}
                                            <button 
                                                className="btn-rec-connect" 
                                                onClick={() => handleConnect(person.id)}
                                                title="Connect"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rec-empty">No matches found. Add skills to your profile!</div>
                                )}
                            </div>

                            <button className="btn-view-all-classic" onClick={() => setShowModal(true)}>
                                View All Matches
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- MODAL (UPDATED TO USE REAL DATA) --- */}
            {showModal && (
                <div className="comm-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="comm-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="comm-modal-header">
                            <h2>Connect with Peers</h2>
                            <button className="comm-close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        
                        <p className="comm-modal-subtitle">
                            Our <b>Hybrid Jaccard Algorithm</b> found these photographers based on your skills, location, and gear overlaps.
                        </p>

                        <div className="comm-modal-list">
                            {recommendations.length > 0 ? recommendations.map((person) => (
                                <div key={person.id} className="comm-modal-item">
                                    <div className="comm-item-left">
                                        {/* Avatar Logic for Modal */}
                                        {person.avatar ? (
                                             <img src={person.avatar} alt={person.name} className="sugg-avatar large" style={{borderRadius: '50%', objectFit: 'cover'}}/>
                                        ) : (
                                            <div className="sugg-avatar large">{person.name.charAt(0)}</div>
                                        )}
                                        
                                        <div>
                                            <h4 className="sugg-name large">{person.name}</h4>
                                            <p className="sugg-role">{person.role} • {person.location}</p>
                                            <span 
                                                className="sugg-match large" 
                                                style={{ color: getMatchColor(person.match), background: `${getMatchColor(person.match)}15` }}
                                            >
                                                {person.match}% Compatibility Score
                                            </span>
                                        </div>
                                    </div>
                                    <button className="btn-connect-large" onClick={() => handleConnect(person.id)}>Connect</button>
                                </div>
                            )) : (
                                <p style={{textAlign:'center', color:'#888'}}>No recommendations available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Community;