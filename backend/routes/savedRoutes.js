const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- 1. GET ALL SAVED FOR A USER ---
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch the saved IDs first
        const { data: savedEntries, error: savedError } = await supabase
            .from('saved_photographers')
            .select('photographer_id')
            .eq('user_id', userId);

        if (savedError) throw savedError;
        if (!savedEntries.length) return res.status(200).json([]);

        // Get the profile details for those IDs
        const ids = savedEntries.map(s => s.photographer_id);
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, location, hourly_rate, skills')
            .in('user_id', ids);

        if (profileError) throw profileError;

        // Format for the frontend
        const result = profiles.map(p => ({
            id: p.user_id,
            name: p.full_name,
            image: p.avatar_url || 'https://via.placeholder.com/400',
            category: p.skills?.[0] || 'Professional',
            location: p.location || 'Remote',
            price: p.hourly_rate ? `₹${p.hourly_rate}/hr` : 'Contact for Price',
            rating: 4.9 // Placeholder until reviews table is ready
        }));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. DELETE (UNSAVE) ---
router.delete('/:userId/:photographerId', async (req, res) => {
    const { userId, photographerId } = req.params;
    try {
        const { error } = await supabase
            .from('saved_photographers')
            .delete()
            .eq('user_id', userId)
            .eq('photographer_id', photographerId);

        if (error) throw error;
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;