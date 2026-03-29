import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Navbar from '../components/Navbar.jsx';
import AvatarFallback from '../components/AvatarFallback.jsx';
import '../styles/Inbox.css';

// ─── Helper: relative time ──────────────────────────────────
function relativeTime(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Helper: date label for separators ──────────────────────
function dateSeparatorLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today - msgDay) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

// ─── Helper: initials from name ─────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Helper: fetch profile by user_id ───────────────────────
async function fetchProfile(userId) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('fetchProfile error for', userId, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('fetchProfile exception:', err);
    return null;
  }
}

// ─── Helper: fetch listing by id ────────────────────────────
async function fetchListing(listingId) {
  if (!listingId) return null;
  try {
    const { data } = await supabase
      .from('listings')
      .select('id, name, image_url, listing_type')
      .eq('id', listingId)
      .single();
    return data;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
//  INBOX PAGE
// ═══════════════════════════════════════════════════════════════
const InboxPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(true);

  // ── Auth (localStorage-based) ──
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setCurrentUser({ id: userId });
    }
  }, []);

  // ── Fetch threads (no FK joins — separate queries) ──
  const fetchThreads = useCallback(async () => {
    if (!currentUser) return;
    try {
      // Get raw threads (no joins)
      const { data: rawThreads, error } = await supabase
        .from('listing_threads')
        .select('id, listing_id, buyer_id, seller_id, status, updated_at')
        .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Enrich each thread with separate queries
      const enriched = await Promise.all(
        (rawThreads || []).map(async (t) => {
          // Determine the other person
          const otherUserId = t.buyer_id === currentUser.id ? t.seller_id : t.buyer_id;

          // Parallel fetches: profile, listing, last message, unread count
          const [otherPerson, listing, lastMsgArr, unreadResult] = await Promise.all([
            fetchProfile(otherUserId),
            fetchListing(t.listing_id),
            supabase
              .from('thread_messages')
              .select('content, created_at, sender_id')
              .eq('thread_id', t.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .then(r => r.data),
            supabase
              .from('thread_messages')
              .select('id', { count: 'exact', head: true })
              .eq('thread_id', t.id)
              .eq('is_read', false)
              .neq('sender_id', currentUser.id)
              .then(r => r.count),
          ]);

          return {
            ...t,
            otherPerson,
            listings: listing,
            lastMessage: lastMsgArr?.[0] || null,
            unreadCount: unreadResult || 0,
          };
        })
      );

      setThreads(enriched);
    } catch (err) {
      console.error('Error fetching threads:', err);
    } finally {
      setThreadsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // ── Content ──
  return (
    <div className="inbox-page">
      <Navbar />
      <div className={`inbox-container ${threadId ? 'thread-active' : ''}`}>
        {/* LEFT: Thread List */}
        <div className="thread-list-panel">
          <div className="thread-list-header">
            <h1>Messages</h1>
          </div>

          <div className="thread-list-scroll">
            {threadsLoading ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="skeleton-thread">
                    <div className="skeleton skeleton-avatar" />
                    <div className="skeleton-lines">
                      <div className="skeleton skeleton-line short" />
                      <div className="skeleton skeleton-line medium" />
                      <div className="skeleton skeleton-line long" />
                    </div>
                  </div>
                ))}
              </>
            ) : threads.length === 0 ? (
              <div className="inbox-empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h3>No conversations yet</h3>
                <p>Browse the marketplace to find gear and connect with photographers.</p>
                <Link to="/marketplace" className="btn-browse">
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              threads.map(thread => (
                <div
                  key={thread.id}
                  className={`thread-item ${threadId === thread.id ? 'active' : ''} ${thread.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => navigate(`/messages/${thread.id}`)}
                >
                  <div className="thread-avatar">
                    <AvatarFallback name={thread.otherPerson?.full_name} imageUrl={thread.otherPerson?.avatar_url} size="md" />
                  </div>
                  <div className="thread-content">
                    <div className="thread-top-row">
                      <span className="thread-name">{thread.otherPerson?.full_name || 'Unknown'}</span>
                      <span className="thread-time">
                        {thread.lastMessage ? relativeTime(thread.lastMessage.created_at) : relativeTime(thread.updated_at)}
                      </span>
                    </div>
                    <div className="thread-listing-tag">
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {thread.listing_id === null ? 'Direct Message' : (thread.listings?.name || 'Listing')}
                      </span>
                      {thread.listings?.listing_type && (
                        <span className={`tag-pill ${thread.listings.listing_type === 'For Sale' ? 'sale' : 'rent'}`}>
                          {thread.listings.listing_type === 'For Sale' ? 'Sale' : 'Rent'}
                        </span>
                      )}
                    </div>
                    <div className="thread-bottom-row">
                      <span className="thread-preview">
                        {thread.lastMessage?.content || 'No messages yet'}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="unread-badge">{thread.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Chat Panel */}
        <div className="chat-panel-wrapper">
          {threadId ? (
            <ChatPanel
              threadId={threadId}
              currentUser={currentUser}
              onBack={() => navigate('/messages')}
              onMessageSent={fetchThreads}
            />
          ) : (
            <div className="chat-panel">
              <div className="no-thread-selected">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  CHAT PANEL (no FK joins — separate queries)
// ═══════════════════════════════════════════════════════════════
const ChatPanel = ({ threadId, currentUser, onBack, onMessageSent }) => {
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sendError, setSendError] = useState('');
  const [justSentIds, setJustSentIds] = useState(new Set());

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // ── Fetch thread metadata (separate queries, no FK joins) ──
  useEffect(() => {
    if (!currentUser || !threadId) return;

    (async () => {
      try {
        setLoading(true);
        setNotFound(false);

        // 1. Get the thread row
        const { data: threadData, error: threadError } = await supabase
          .from('listing_threads')
          .select('id, listing_id, buyer_id, seller_id, status')
          .eq('id', threadId)
          .single();

        if (threadError || !threadData) {
          setNotFound(true);
          return;
        }

        // 2. Verify current user is a participant
        if (threadData.buyer_id !== currentUser.id && threadData.seller_id !== currentUser.id) {
          setNotFound(true);
          return;
        }

        // 3. Fetch related data in parallel
        const otherUserId = threadData.buyer_id === currentUser.id
          ? threadData.seller_id
          : threadData.buyer_id;

        const [otherPerson, listing] = await Promise.all([
          fetchProfile(otherUserId),
          fetchListing(threadData.listing_id),
        ]);

        setThread({
          ...threadData,
          otherPerson,
          listings: listing,
        });
      } catch (err) {
        console.error('Error fetching thread:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [threadId, currentUser]);

  // ── Fetch messages ──
  useEffect(() => {
    if (!threadId || !currentUser) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('thread_messages')
          .select('*')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Mark messages as read
        await supabase
          .from('thread_messages')
          .update({ is_read: true })
          .eq('thread_id', threadId)
          .eq('is_read', false)
          .neq('sender_id', currentUser.id);

        setTimeout(() => scrollToBottom(false), 100);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    })();
  }, [threadId, currentUser, scrollToBottom]);

  // ── Realtime subscription ──
  useEffect(() => {
    if (!threadId || !currentUser) return;

    const channel = supabase
      .channel(`thread-${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'thread_messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender_id !== currentUser.id) {
            supabase
              .from('thread_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id)
              .then();
          }

          setTimeout(() => scrollToBottom(true), 50);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, currentUser, scrollToBottom]);

  // ── Send message ──
  const handleSend = async () => {
    const content = inputText.trim();
    if (!content || !currentUser || !threadId) return;

    setSendError('');

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      thread_id: threadId,
      sender_id: currentUser.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setJustSentIds(prev => new Set(prev).add(tempId));
    setInputText('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => scrollToBottom(true), 50);

    try {
      const { data, error } = await supabase
        .from('thread_messages')
        .insert({
          thread_id: threadId,
          sender_id: currentUser.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => prev.map(m => m.id === tempId ? data : m));
      onMessageSent?.();
    } catch (err) {
      console.error('Error sending message:', err);
      setSendError('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInputText(content);
    }
  };

  // ── Auto-grow textarea ──
  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  // ── Key handler ──
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render: Loading ──
  if (loading) {
    return (
      <div className="chat-panel">
        <div className="chat-header">
          <div className="skeleton skeleton-avatar" style={{ width: 40, height: 40 }} />
          <div className="skeleton-lines" style={{ flex: 1 }}>
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line medium" style={{ height: 8 }} />
          </div>
        </div>
        <div className="skeleton-chat" style={{ flex: 1 }}>
          <div className="skeleton skeleton-bubble left" />
          <div className="skeleton skeleton-bubble right" />
          <div className="skeleton skeleton-bubble left" style={{ width: '40%' }} />
          <div className="skeleton skeleton-bubble right" style={{ width: '55%' }} />
          <div className="skeleton skeleton-bubble left" />
        </div>
      </div>
    );
  }

  // ── Render: Not found ──
  if (notFound) {
    return (
      <div className="chat-panel">
        <div className="thread-not-found">
          <h3>Thread not found</h3>
          <p>This conversation doesn't exist or you don't have access.</p>
          <button onClick={onBack}>← Back to Inbox</button>
        </div>
      </div>
    );
  }

  if (!thread) return null;

  // ── Build messages with grouping + date separators ──
  const renderMessages = () => {
    const elements = [];
    let lastDate = null;
    let lastSenderId = null;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isSent = msg.sender_id === currentUser.id;
      const msgDate = dateSeparatorLabel(msg.created_at);
      const nextMsg = messages[i + 1];

      if (msgDate !== lastDate) {
        elements.push(
          <div key={`date-${msgDate}-${i}`} className="date-separator">
            <span>{msgDate}</span>
          </div>
        );
        lastDate = msgDate;
        lastSenderId = null;
      }

      const isGrouped = lastSenderId === msg.sender_id;
      const isGroupLast = !nextMsg || nextMsg.sender_id !== msg.sender_id ||
        dateSeparatorLabel(nextMsg.created_at) !== msgDate;
      const isJustSent = justSentIds.has(msg.id);

      const wrapperClasses = [
        'message-wrapper',
        isSent ? 'sent' : 'received',
        isGrouped ? 'grouped' : '',
        isGroupLast ? 'group-last' : '',
        isJustSent ? 'just-sent' : '',
      ].filter(Boolean).join(' ');

      const showTimestamp = isGroupLast;

      elements.push(
        <div key={msg.id} className={wrapperClasses}>
          {!isSent && (
            <div className={`msg-avatar ${isGrouped ? 'hidden' : ''}`}>
              <AvatarFallback name={thread.otherPerson?.full_name} imageUrl={thread.otherPerson?.avatar_url} size="sm" />
            </div>
          )}

          <div>
            <div className="message-bubble">{msg.content}</div>
            {showTimestamp && (
              <div className="message-time">
                {new Date(msg.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
            )}
          </div>
        </div>
      );

      lastSenderId = msg.sender_id;
    }

    return elements;
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <button className="chat-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="chat-header-avatar">
          <AvatarFallback name={thread.otherPerson?.full_name} imageUrl={thread.otherPerson?.avatar_url} size="md" />
        </div>

        <div className="chat-header-info">
          <div className="chat-header-name">
            {thread.otherPerson?.full_name || 'Unknown'}
          </div>
          {thread.listing_id === null ? (
            <span className="chat-header-listing" style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', cursor: 'default' }}>
              Direct Message
            </span>
          ) : thread.listings ? (
            <Link
              to={`/marketplace/item/${thread.listings.id}`}
              className="chat-header-listing"
            >
              {thread.listings.name}
            </Link>
          ) : null}
        </div>

        <span className={`status-pill ${thread.status}`}>
          {thread.status}
        </span>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={chatContainerRef}>
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Error */}
      {sendError && (
        <div className="send-error">
          <p>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {sendError}
          </p>
        </div>
      )}

      {/* Input Bar */}
      <div className="chat-input-bar">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Type a message..."
          value={inputText}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!inputText.trim()}
          title="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InboxPage;
