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

module.exports = router;