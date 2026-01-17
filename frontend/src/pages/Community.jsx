import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { X } from "lucide-react"; // Import Close Icon
import './Community.css'; 

const Community = () => {
  // --- STATE ---
  const [showModal, setShowModal] = useState(false); // Controls the "View All" Modal

  // Existing Discussion Data
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best Camera Settings for Outdoor Portraits during Golden Hour",
      author: "Sarah Johnson",
      likes: 45,
      hasLiked: false,
      category: "Tips & Tricks",
      time: "2 hours ago",
      comments: [
        { id: 101, user: "Mike", text: "I usually stick to f/2.8 to get that creamy bokeh!" },
        { id: 102, user: "Anna", text: "Don't forget to check your white balance." }
      ]
    },
    {
      id: 2,
      title: "Is the upgrade to Mirrorless really worth it?",
      author: "Mike Chen",
      likes: 156,
      hasLiked: true,
      category: "Gear Talk",
      time: "4 hours ago",
      comments: []
    },
    {
      id: 3,
      title: "Critique Request: Moody street photography in Tokyo",
      author: "Emma Davis",
      likes: 34,
      hasLiked: false,
      category: "Critique",
      time: "1 day ago",
      comments: [{ id: 103, user: "Tom", text: "Great contrast! Maybe crop the left side a bit?" }]
    }
  ]);

  // ALGORITHM DATA: Full List (For the Modal)
  const allSuggestions = [
    { id: 1, name: "David Lo", role: "Wedding Photographer", match: 95, location: "Kochi", isConnected: false },
    { id: 2, name: "Maria K", role: "Fashion & Editorial", match: 88, location: "Mumbai", isConnected: false },
    { id: 3, name: "John Doe", role: "Landscape & Travel", match: 72, location: "Bangalore", isConnected: false },
    { id: 4, name: "Pixel Studio", role: "Post-Processing", match: 68, location: "Remote", isConnected: false },
    { id: 5, name: "Sarah J", role: "Portrait Specialist", match: 65, location: "Delhi", isConnected: false },
    { id: 6, name: "Arjun V", role: "Cinematographer", match: 60, location: "Chennai", isConnected: false },
  ];

  // Sidebar Widget Data (Top 3 only)
  const sidebarSuggestions = allSuggestions.slice(0, 3);

  const [activeCommentId, setActiveCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // --- ACTIONS ---
  const handleLike = (id) => { /* Same as before */ 
    setDiscussions(discussions.map(p => p.id === id ? { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes-1 : p.likes+1 } : p));
  };

  const toggleComments = (id) => {
    setActiveCommentId(activeCommentId === id ? null : id);
  };

  const handleReplySubmit = (postId) => { /* Same as before */ 
    if (!replyText.trim()) return;
    setDiscussions(discussions.map(p => p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), user: "You", text: replyText }] } : p));
    setReplyText("");
  };

  // Connect Logic (Updates visuals only for demo)
  const handleConnect = (id) => {
    // In real app: API call here
    alert(`Connection request sent to User ID: ${id}`);
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
                {discussions.map((discussion) => (
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
                                    <input type="text" className="reply-input" placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(discussion.id)}/>
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
                ))}
            </div>

            {/* RIGHT: SIDEBAR */}
            <div className="sidebar-section">
                {/* Widget 1: Create */}
                <div className="sidebar-card mb-6">
                    <h3 className="sidebar-title">Start a Discussion</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>Share your thoughts or ask for advice.</p>
                    <input type="text" className="create-input" placeholder="Title..." />
                    <textarea className="create-input" placeholder="Content..." rows="3" style={{ resize: 'none' }}></textarea>
                    <button className="btn-create-post">Post to Forum</button>
                </div>

                {/* Widget 2: Suggestions */}
                <div className="sidebar-card">
                    <h3 className="sidebar-title">Recommended for You</h3>
                    <p style={{fontSize: '0.8rem', color: '#71717a', marginBottom: '1.2rem', lineHeight: '1.4'}}>
                        Curated based on your style & gear compatibility (Jaccard Algo).
                    </p>
                    <div className="suggestion-list">
                        {sidebarSuggestions.map((person) => (
                            <div key={person.id} className="suggestion-item">
                                <div className="sugg-avatar">{person.name.charAt(0)}</div>
                                <div className="sugg-info">
                                    <h4 className="sugg-name">{person.name}</h4>
                                    <div className="sugg-meta">
                                        <span className="sugg-role">{person.role}</span>
                                        <span className="sugg-match">{person.match}% Match</span>
                                    </div>
                                </div>
                                <button className="btn-connect" onClick={() => handleConnect(person.id)}>+</button>
                            </div>
                        ))}
                    </div>
                    {/* BUTTON TO OPEN MODAL */}
                    <button className="btn-view-all" onClick={() => setShowModal(true)}>View All Recommendations</button>
                </div>
            </div>

        </div>
      </div>

      {/* --- THE CLASSIC MODAL --- */}
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
                    {allSuggestions.map((person) => (
                        <div key={person.id} className="comm-modal-item">
                            <div className="comm-item-left">
                                <div className="sugg-avatar large">{person.name.charAt(0)}</div>
                                <div>
                                    <h4 className="sugg-name large">{person.name}</h4>
                                    <p className="sugg-role">{person.role} • {person.location}</p>
                                    <span className="sugg-match large">{person.match}% Compatibility Score</span>
                                </div>
                            </div>
                            <button className="btn-connect-large" onClick={() => handleConnect(person.id)}>Connect</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Community;