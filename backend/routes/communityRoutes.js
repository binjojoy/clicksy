const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); 

// --- 1. GET ALL POSTS (With "Has Liked" Check) ---
router.get('/posts', async (req, res) => {
    try {
        const currentUserId = req.query.userId; // Frontend will send this now

        // A. Fetch Posts
        const { data: posts, error: postError } = await supabase
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postError) throw postError;

        // B. Fetch Profiles & Comments (Same as before)
        const { data: profiles } = await supabase.from('profiles').select('user_id, full_name');
        const { data: comments } = await supabase.from('forum_comments').select('*');
        
        // C. Fetch YOUR Votes (To see what is red)
        let myVotes = [];
        if (currentUserId) {
            const { data: votes } = await supabase
                .from('forum_votes')
                .select('post_id')
                .eq('user_id', currentUserId);
            myVotes = votes ? votes.map(v => v.post_id) : [];
        }

        // D. Create Maps
        const profileMap = {};
        if (profiles) profiles.forEach(p => profileMap[p.user_id] = p.full_name);

        // E. Format Data
        const formattedPosts = posts.map(post => {
            const postComments = comments ? comments.filter(c => c.post_id === post.id) : [];
            
            return {
                id: post.id,
                title: post.title,
                author: profileMap[post.user_id] || "Unknown Photographer",
                likes: post.upvotes || 0,
                hasLiked: myVotes.includes(post.id), // True if you voted!
                category: post.category,
                time: new Date(post.created_at).toLocaleDateString(),
                comments: postComments.map(c => ({
                    id: c.id,
                    user: profileMap[c.user_id] || "Anonymous",
                    text: c.content
                }))
            };
        });

        res.status(200).json(formattedPosts);

    } catch (err) {
        console.error('Error fetching feed:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 2. CREATE POST (Unchanged) ---
router.post('/posts', async (req, res) => {
    /* ... Keep your existing CREATE POST code here ... */
    // (If you lost it, let me know, but it should be the same as before)
    try {
        const { user_id, title, content, category } = req.body;
        const { data, error } = await supabase.from('forum_posts').insert([{ user_id, title, content, category }]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- 3. COMMENT (Unchanged) ---
router.post('/posts/:postId/comment', async (req, res) => {
    /* ... Keep existing COMMENT code ... */
    try {
        const { postId } = req.params;
        const { user_id, content } = req.body;
        const { data, error } = await supabase.from('forum_comments').insert([{ post_id: postId, user_id, content }]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- 4. TOGGLE LIKE (New Logic) ---
router.put('/posts/:postId/like', async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.body; // We need to know WHO is liking

        if (!user_id) return res.status(400).json({ error: "User ID required" });

        // 1. Check if vote exists
        const { data: existingVote } = await supabase
            .from('forum_votes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', user_id)
            .single();

        let newCount;
        let isLiked;

        // 2. Get current post count
        const { data: post } = await supabase.from('forum_posts').select('upvotes').eq('id', postId).single();
        let currentUpvotes = post.upvotes || 0;

        if (existingVote) {
            // A. UNLIKE: Delete vote, Decrement count
            await supabase.from('forum_votes').delete().eq('user_id', user_id).eq('post_id', postId);
            newCount = Math.max(0, currentUpvotes - 1);
            isLiked = false;
        } else {
            // B. LIKE: Insert vote, Increment count
            await supabase.from('forum_votes').insert([{ user_id, post_id: postId }]);
            newCount = currentUpvotes + 1;
            isLiked = true;
        }

        // 3. Update Post Table
        await supabase.from('forum_posts').update({ upvotes: newCount }).eq('id', postId);

        res.status(200).json({ likes: newCount, hasLiked: isLiked });

    } catch (err) {
        console.error('Error toggling like:', err.message);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

module.exports = router;