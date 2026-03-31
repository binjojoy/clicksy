const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); 

// --- 1. GET ALL POSTS ---
// [Unchanged - keeping your existing logic]
router.get('/posts', async (req, res) => {
    try {
        const currentUserId = req.query.userId;
        const { data: posts, error: postError } = await supabase
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (postError) throw postError;

        const { data: profiles } = await supabase.from('profiles').select('user_id, full_name');
        const { data: comments } = await supabase.from('forum_comments').select('*');
        
        let myVotes = [];
        if (currentUserId) {
            const { data: votes } = await supabase
                .from('forum_votes')
                .select('post_id')
                .eq('user_id', currentUserId);
            myVotes = votes ? votes.map(v => v.post_id) : [];
        }

        const profileMap = {};
        if (profiles) profiles.forEach(p => profileMap[p.user_id] = p.full_name);

        const formattedPosts = posts.map(post => {
            const postComments = comments ? comments.filter(c => c.post_id === post.id) : [];
            return {
                id: post.id,
                title: post.title,
                author: profileMap[post.user_id] || "Unknown Photographer",
                likes: post.upvotes || 0,
                hasLiked: myVotes.includes(post.id),
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

// --- 2. CREATE POST ---
router.post('/posts', async (req, res) => {
    try {
        const { user_id, title, content, category } = req.body;
        const { data, error } = await supabase.from('forum_posts').insert([{ user_id, title, content, category }]).select().single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// --- 3. COMMENT (WITH NOTIFICATION TRIGGER) ---
router.post('/posts/:postId/comment', async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id, content } = req.body;

        // 1. Insert the comment
        const { data: comment, error } = await supabase
            .from('forum_comments')
            .insert([{ post_id: postId, user_id, content }])
            .select()
            .single();

        if (error) throw error;

        // ⚡ TRIGGER: Notify Post Owner
        // Fetch post info and commenter name
        const [postRes, userRes] = await Promise.all([
            supabase.from('forum_posts').select('user_id, title').eq('id', postId).single(),
            supabase.from('profiles').select('full_name').eq('user_id', user_id).single()
        ]);

        const postOwnerId = postRes.data?.user_id;
        const commenterName = userRes.data?.full_name || "Someone";

        // Don't notify if I comment on my own post
        if (postOwnerId && postOwnerId !== user_id) {
            await supabase.from('notifications').insert({
                user_id: postOwnerId,
                type: 'comment',
                title: 'New Comment',
                content: `${commenterName} commented on your post: "${postRes.data.title}"`,
                related_id: postId
            });
        }

        res.status(201).json(comment);
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: 'Failed' }); 
    }
});

// --- 4. TOGGLE LIKE (WITH NOTIFICATION TRIGGER) ---
router.put('/posts/:postId/like', async (req, res) => {
    try {
        const { postId } = req.params;
        const { user_id } = req.body;

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

        // 2. Get current post data
        const { data: post } = await supabase.from('forum_posts').select('upvotes, user_id, title').eq('id', postId).single();
        let currentUpvotes = post.upvotes || 0;

        if (existingVote) {
            // A. UNLIKE
            await supabase.from('forum_votes').delete().eq('user_id', user_id).eq('post_id', postId);
            newCount = Math.max(0, currentUpvotes - 1);
            isLiked = false;
        } else {
            // B. LIKE
            await supabase.from('forum_votes').insert([{ user_id, post_id: postId }]);
            newCount = currentUpvotes + 1;
            isLiked = true;

            // ⚡ TRIGGER: Notify Post Owner (Only on new Likes)
            const { data: LikerProfile } = await supabase.from('profiles').select('full_name').eq('user_id', user_id).single();
            
            if (post.user_id !== user_id) {
                await supabase.from('notifications').insert({
                    user_id: post.user_id,
                    type: 'vote',
                    title: 'New Like',
                    content: `${LikerProfile?.full_name || 'Someone'} liked your post: "${post.title}"`,
                    related_id: postId
                });
            }
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