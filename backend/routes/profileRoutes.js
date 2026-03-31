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
// --- 4. TOGGLE FOLLOW (Follow/Unfollow Logic) ---
router.post('/:targetId/follow', async (req, res) => {
    try {
        const { targetId } = req.params;
        const { userId } = req.body; 

        if (userId === targetId) return res.status(400).json({ error: "Cannot follow self" });

        const { data: existing } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', userId)
            .eq('following_id', targetId)
            .single();

        let isFollowing = false;

        if (existing) {
            await supabase.from('follows').delete().eq('follower_id', userId).eq('following_id', targetId);
            isFollowing = false;
        } else {
            await supabase.from('follows').insert({ follower_id: userId, following_id: targetId });
            isFollowing = true;

            // --- ⚡ START NOTIFICATION TRIGGER ⚡ ---
            const { data: followerProfile } = await supabase.from('profiles').select('full_name').eq('user_id', userId).single();
            const { data: targetProfile } = await supabase.from('profiles').select('full_name').eq('user_id', targetId).single();

            // 1. Notify the Target (e.g. Photographer)
            await supabase.from('notifications').insert({
                user_id: targetId,
                type: 'follow',
                title: 'New Follower',
                content: `${followerProfile?.full_name || 'Someone'} started following you!`,
                related_id: userId
            });

            // 2. Update Actor's Feed (e.g. Client/Binjo Joy)
            await supabase.from('notifications').insert({
                user_id: userId,
                type: 'follow',
                title: 'New Connection',
                content: `You started following ${targetProfile?.full_name || 'a new creator'}`,
                related_id: targetId
            });
            // --- ⚡ END NOTIFICATION TRIGGER ⚡ ---
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

// --- 7. GET TRENDING / SPOTLIGHT PHOTOGRAPHER ---
// Route: GET /api/v1/profile/spotlight/trending
router.get('/spotlight/trending', async (req, res) => {
    try {
        // Basic Algorithm: Fetch a photographer with an avatar
        const { data, error } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, bio, skills')
            .eq('user_type', 'photographer')
            .not('avatar_url', 'is', null) // Prioritize people with profile pictures
            .limit(1)
            .single();

        if (error) throw error;

        // Extract their first skill to use as a "Category", or default to "Professional"
        const category = data.skills && data.skills.length > 0 ? data.skills[0] : "Professional Photographer";

        res.status(200).json({
            id: data.user_id,
            name: data.full_name,
            category: category,
            image: data.avatar_url,
            rating: 4.9 // Placeholder until you build a reviews table
        });

    } catch (err) {
        console.error('Trending fetch error:', err.message);
        // Fallback mock if database is empty so your UI doesn't break
        res.status(200).json({
            id: 104, name: "Sarah Jenkins", category: "Fashion & Editorial", 
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500&h=300", 
            rating: 4.9 
        });
    }
});

// --- 6.5 GET FOLLOWING LIST (People this user follows) ---
router.get('/:userId/following', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Get the IDs of the people this user is following
        const { data: followRows, error: followError } = await supabase
            .from('follows')
            .select('following_id, created_at')
            .eq('follower_id', userId);

        if (followError) throw followError;

        if (!followRows || followRows.length === 0) {
            return res.status(200).json([]);
        }

        const followingIds = followRows.map(row => row.following_id);

        // 2. Fetch their actual profile details
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, user_type, location')
            .in('user_id', followingIds);

        if (profileError) throw profileError;

        // 3. Format it for the frontend
        const result = profiles.map(profile => ({
            id: profile.user_id,
            name: profile.full_name || "Anonymous User",
            avatar: profile.avatar_url,
            role: profile.user_type || "Member",
            location: profile.location || "Earth"
        }));

        res.status(200).json(result);

    } catch (err) {
        console.error('Error fetching following list:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Route: GET /api/v1/profile/explore/photographers
// Route: GET /api/v1/profile/explore/photographers
router.get('/explore/photographers', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_type', 'photographer') // Standardized role
            .order('is_verified', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Route: GET /api/v1/profile/explore/inspiration
// Route: GET /api/v1/profile/explore/inspiration
router.get('/explore/inspiration', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select(`
                id, 
                title, 
                media_url, 
                profiles (
                    full_name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(12);

        if (error) throw error;

        // Flatten the data so the frontend gets exactly what it needs
        const formatted = data.map(item => ({
            id: item.id,
            title: item.title || "Untitled",
            image_url: item.media_url, // Maps to your schema
            photographer_name: item.profiles?.full_name || "Anonymous"
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Inspiration Route Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Route: GET /api/v1/profile/explore/locations

router.get('/explore/locations', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('location')
            .eq('user_type', 'photographer')
            .not('location', 'is', null);

        if (error) throw error;

        // Normalize to lowercase for counting, then capitalize for the UI
        const counts = data.reduce((acc, profile) => {
            const loc = profile.location.trim().toLowerCase();
            if (loc) {
                const display = loc.charAt(0).toUpperCase() + loc.slice(1);
                acc[display] = (acc[display] || 0) + 1;
            }
            return acc;
        }, {});

        // Sort by count descending
        const sorted = Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json(sorted);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Route: GET /api/v1/profile/explore/collections
router.get('/explore/collections', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('Collections Fetch Error:', err.message);
        res.status(500).json({ error: 'Failed to load collections' });
    }
});

module.exports = router;