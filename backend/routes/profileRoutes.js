const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- 1. GET PROFILE (For Pre-filling & Display) ---
// Route: GET /api/v1/profile/:userId
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Fetch from Supabase
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw error;
        }

        // 2. If new user (no profile yet), return empty structure with ALL fields
        if (!data) {
            return res.status(200).json({
                user_id: userId,
                full_name: '',
                bio: '',
                location: '',
                phone_number: '',
                skills: [],
                hourly_rate: null,
                social_links: { instagram: '', twitter: '' },
                website: '',      
                avatar_url: null, // <--- FIXED: Explicitly included now
                banner_url: null, 
                is_verified: false
            });
        }

        // 3. Return existing data
        res.status(200).json(data);

    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 2. UPDATE PROFILE ---
// Route: PUT /api/v1/profile
router.put('/', async (req, res) => {
    try {
        // 1. Destructure ALL fields from the request body
        const { 
            user_id, full_name, bio, location, phone_number, 
            skills, hourly_rate, portfolio_intro, social_links, 
            user_type,
            avatar_url, // <--- Ensure this is captured
            banner_url, 
            website     
        } = req.body;

        // 2. Add them to the updates object
        const updates = {
            user_id,
            full_name,
            bio,
            location,
            phone_number,
            skills, 
            hourly_rate: hourly_rate ? parseFloat(hourly_rate) : null,
            portfolio_intro,
            social_links,
            user_type,
            avatar_url, // <--- Saving Avatar
            banner_url, // <--- Saving Banner
            website,    // <--- Saving Website
            // updated_at: new Date() // Supabase handles this, but you can uncomment if needed
        };

        // 3. UPSERT: Update if exists, Insert if new
        const { data, error } = await supabase
            .from('profiles')
            .upsert(updates, { onConflict: 'user_id' })
            .select();

        if (error) throw error;

        res.status(200).json({ success: true, data });

    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// --- 3. GET PORTFOLIO & STATS ---
// Route: GET /api/v1/profile/:userId/portfolio
router.get('/:userId/portfolio', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Fetch items from the 'portfolio_items' table
        const { data: items, error } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }); // Newest first

        if (error) throw error;

        // 2. Transform the data for the Frontend
        // - Map 'media_url' (DB) to 'image_url' (Frontend)
        // - Generate a random 'likes' count (since DB doesn't have it yet)
        const formattedItems = items.map(item => ({
            id: item.id,
            title: item.title,
            image_url: item.media_url, // <--- Mapping for UI
            category: item.category,
            likes: Math.floor(Math.random() * 500) + 50 // Fake likes for demo
        }));

        // 3. Calculate Stats
        const totalShots = items.length;
        const totalLikes = formattedItems.reduce((sum, item) => sum + item.likes, 0);

        // 4. Return everything in one JSON object
        res.status(200).json({
            portfolio: formattedItems,
            stats: {
                shots: totalShots,
                likes: totalLikes
            }
        });

    } catch (err) {
        console.error('Error fetching portfolio:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 4. TOGGLE FOLLOW (Follow/Unfollow Logic) ---
// Route: POST /api/v1/profile/:id/follow
router.post('/:targetId/follow', async (req, res) => {
    try {
        const { targetId } = req.params;
        const { userId } = req.body; // Sent from frontend

        if (userId === targetId) return res.status(400).json({ error: "Cannot follow self" });

        // 1. Check if relationship exists
        const { data: existing } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', userId)
            .eq('following_id', targetId)
            .single();

        let isFollowing = false;

        if (existing) {
            // UNFOLLOW: Delete the row
            await supabase.from('follows').delete().eq('follower_id', userId).eq('following_id', targetId);
            isFollowing = false;
        } else {
            // FOLLOW: Insert the row
            await supabase.from('follows').insert({ follower_id: userId, following_id: targetId });
            isFollowing = true;
        }

        res.status(200).json({ isFollowing });

    } catch (err) {
        console.error('Follow error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 5. CHECK FOLLOW STATUS & COUNTS ---
// Route: GET /api/v1/profile/:targetId/follow-stats?currentUserId=...
router.get('/:targetId/follow-stats', async (req, res) => {
    try {
        const { targetId } = req.params;
        const { currentUserId } = req.query;

        // 1. Get Total Followers Count
        const { count: followersCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', targetId);

        // 2. Get Total Following Count
        const { count: followingCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', targetId);

        // 3. Check if Current User is Following
        let isFollowing = false;
        if (currentUserId) {
            const { data } = await supabase
                .from('follows')
                .select('*')
                .eq('follower_id', currentUserId)
                .eq('following_id', targetId)
                .single();
            if (data) isFollowing = true;
        }

        res.status(200).json({ followersCount, followingCount, isFollowing });

    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});


// --- 6. GET FOLLOWERS LIST ---
// Route: GET /api/v1/profile/:userId/followers
// --- 6. GET FOLLOWERS LIST (FAIL-SAFE VERSION) ---
// Route: GET /api/v1/profile/:userId/followers
router.get('/:userId/followers', async (req, res) => {
    try {
        const { userId } = req.params;

        // STEP 1: Get the list of IDs who follow this user
        const { data: followRows, error: followError } = await supabase
            .from('follows')
            .select('follower_id, created_at')
            .eq('following_id', userId);

        if (followError) throw followError;

        // If no followers, return empty immediately to prevent errors
        if (!followRows || followRows.length === 0) {
            return res.status(200).json([]);
        }

        // Extract just the IDs array: ['id1', 'id2', ...]
        const followerIds = followRows.map(row => row.follower_id);

        // STEP 2: Fetch the actual profile details for these IDs
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, user_type, location')
            .in('user_id', followerIds);

        if (profileError) throw profileError;

        // STEP 3: Merge the data (Optional: preserves 'followedAt' date)
        const result = profiles.map(profile => {
            const followInfo = followRows.find(row => row.follower_id === profile.user_id);
            return {
                id: profile.user_id,
                name: profile.full_name || "Anonymous User",
                avatar: profile.avatar_url,
                role: profile.user_type || "Member",
                location: profile.location || "Earth",
                followedAt: followInfo ? followInfo.created_at : null
            };
        });

        res.status(200).json(result);

    } catch (err) {
        console.error('Error fetching followers:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;