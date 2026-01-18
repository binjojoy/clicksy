// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); // Ensure this path is correct

// --- 1. GET PROFILE (For Pre-filling) ---
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

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" (New user)
            throw error;
        }

        // 2. If new user (no profile yet), return empty structure to avoid frontend crash
        if (!data) {
            return res.status(200).json({
                user_id: userId,
                full_name: '',
                bio: '',
                location: '',
                phone_number: '',
                skills: [],
                social_links: { instagram: '', twitter: '', website: '' }
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
        const { 
            user_id, full_name, bio, location, phone_number, 
            skills, hourly_rate, portfolio_intro, social_links, 
            avatar_url, user_type 
        } = req.body;

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
            avatar_url,
            user_type,
            //updated_at: new Date() // Timestamp for the update
        };

        // UPSERT: Update if exists, Insert if new
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