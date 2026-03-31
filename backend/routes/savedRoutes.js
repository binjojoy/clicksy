const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- 1. POST (SAVE) ---
router.post('/', async (req, res) => {
    try {
        const { user_id, photographer_id } = req.body;

        if (!user_id || !photographer_id) {
            return res.status(400).json({ error: 'Missing required IDs' });
        }

        const { data, error } = await supabase
            .from('saved_photographers')
            .insert([{ user_id, photographer_id }])
            .select()
            .single();

        if (error) {
            // Check for Unique Constraint violation
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Already saved' });
            }
            throw error;
        }

        res.status(201).json({ success: true, data });
    } catch (err) {
        console.error('Save Error:', err.message);
        res.status(500).json({ error: 'Failed to save' });
    }
});

// --- 2. GET ALL SAVED ---
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data: entries, error } = await supabase
            .from('saved_photographers')
            .select('photographer_id')
            .eq('user_id', userId);

        if (error) throw error;
        if (!entries.length) return res.status(200).json([]);

        // Get profile details for the photographer_id list
        const ids = entries.map(e => e.photographer_id);
        const { data: profiles, error: profileErr } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, location, hourly_rate, skills')
            .in('user_id', ids);

        if (profileErr) throw profileErr;

        const formatted = profiles.map(p => ({
            id: p.user_id,
            name: p.full_name,
            image: p.avatar_url,
            category: p.skills?.[0] || 'Professional',
            location: p.location,
            price: p.hourly_rate ? `₹${p.hourly_rate}/hr` : 'Contact for Rates'
        }));

        res.status(200).json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. DELETE (UNSAVE) ---
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