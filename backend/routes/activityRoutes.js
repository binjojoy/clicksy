const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- GET /api/v1/activity/:userId ---
// Usage: /api/v1/activity/UUID?limit=4 (for dashboard)
// Usage: /api/v1/activity/UUID (for full history)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit } = req.query;

        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const { data: notifications, error } = await query;

        if (error) throw error;

        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching activity feed:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- PATCH /api/v1/activity/read-all/:userId ---
router.patch('/read-all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date() })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;