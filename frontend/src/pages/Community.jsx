import React, { useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import './Community.css'; 

const Community = () => {
  // 1. STATE: We use state now so likes/comments can update instantly
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best Camera Settings for Outdoor Portraits during Golden Hour",
      author: "Sarah Johnson",
      likes: 45,
      hasLiked: false, // Track if I liked it
      category: "Tips & Tricks",
      time: "2 hours ago",
      // Dummy comments for 'classic' feel
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

  const [activeCommentId, setActiveCommentId] = useState(null); // Which post is expanded?
  const [replyText, setReplyText] = useState(""); // Current input text

  // --- ACTIONS ---

  // 1. Handle Like Toggle
  const handleLike = (id) => {
    setDiscussions(discussions.map(post => {
        if (post.id === id) {
            return {
                ...post,
                hasLiked: !post.hasLiked,
                likes: post.hasLiked ? post.likes - 1 : post.likes + 1
            };
        }
        return post;
    }));
  };

  // 2. Toggle Comment Section
  const toggleComments = (id) => {
    if (activeCommentId === id) {
        setActiveCommentId(null); // Close if already open
    } else {
        setActiveCommentId(id); // Open new one
    }
  };

  // 3. Submit a Reply
  const handleReplySubmit = (postId) => {
    if (!replyText.trim()) return;

    setDiscussions(discussions.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                comments: [...post.comments, { id: Date.now(), user: "You", text: replyText }]
            };
        }
        return post;
    }));
    
    setReplyText(""); // Clear input
  };

  return (
    <div className="community-page">
      <Navbar />

      <div className="community-container">
        
        {/* --- HEADER --- */}
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

        {/* --- MAIN GRID --- */}
        <div className="forum-grid">
            
            {/* LEFT: FEED */}
            <div className="feed-section">
                {discussions.map((discussion) => (
                    <div key={discussion.id} className="discussion-card">
                        
                        {/* 1. Main Content */}
                        <div className="card-content-padding">
                            <div className="card-top">
                                <span className="category-badge">{discussion.category}</span>
                                <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{discussion.time}</span>
                            </div>
                            
                            <h3 className="discussion-title" onClick={() => toggleComments(discussion.id)}>
                                {discussion.title}
                            </h3>
                            
                            {/* Interactive Meta Bar */}
                            <div className="discussion-meta">
                                <span style={{ color: 'white', fontWeight: '500' }}>@{discussion.author}</span>
                                
                                {/* LIKE BUTTON */}
                                <button 
                                    className={`meta-btn ${discussion.hasLiked ? 'liked' : ''}`}
                                    onClick={() => handleLike(discussion.id)}
                                >
                                    <svg width="18" height="18" fill={discussion.hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    {discussion.likes}
                                </button>

                                {/* REPLY BUTTON */}
                                <button 
                                    className={`meta-btn ${activeCommentId === discussion.id ? 'active' : ''}`}
                                    onClick={() => toggleComments(discussion.id)}
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                    {discussion.comments.length} Replies
                                </button>
                            </div>
                        </div>

                        {/* 2. Expanded Comment Section (Conditional Render) */}
                        {activeCommentId === discussion.id && (
                            <div className="comments-section">
                                {/* Input */}
                                <div className="reply-box">
                                    <input 
                                        type="text" 
                                        className="reply-input"
                                        placeholder="Write a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(discussion.id)}
                                    />
                                    <button className="btn-send" onClick={() => handleReplySubmit(discussion.id)}>
                                        Post
                                    </button>
                                </div>

                                {/* List */}
                                <div className="comment-list">
                                    {discussion.comments.length === 0 && (
                                        <p style={{color: '#52525b', fontStyle: 'italic', fontSize: '0.9rem'}}>No replies yet. Be the first!</p>
                                    )}
                                    {discussion.comments.map(comment => (
                                        <div key={comment.id} className="single-comment">
                                            <div className="comment-avatar"></div> {/* Placeholder avatar */}
                                            <div className="comment-body">
                                                <span className="comment-author">{comment.user}</span>
                                                {comment.text}
                                            </div>
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
                <div className="sidebar-card">
                    <h3 className="sidebar-title">Start a Discussion</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Share your thoughts or ask for advice.
                    </p>
                    
                    <input type="text" className="create-input" placeholder="Title..." />
                    <textarea className="create-input" placeholder="Content..." rows="3" style={{ resize: 'none' }}></textarea>

                    <button className="btn-create-post">Post to Forum</button>
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;