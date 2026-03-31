const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- 1. ADD APPRECIATION ---
// Route: POST /api/v1/appreciations
router.post('/', async (req, res) => {
    try {
        const { appreciator_id, portfolio_item_id, photographer_id } = req.body;

        if (!appreciator_id || !portfolio_item_id || !photographer_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (appreciator_id === photographer_id) {
            return res.status(403).json({ error: "Cannot appreciate own work" });
        }

        const { error } = await supabase
            .from('appreciations')
            .insert({
                appreciator_id,
                portfolio_item_id,
                photographer_id
            });

        if (error) {
            // 23505 is unique violation in Postgres
            if (error.code === '23505') {
                return res.status(409).json({ error: "Already appreciated" });
            }
            throw error;
        }

        // Optional: Trigger a notification to the photographer here

        res.status(201).json({ message: "Appreciated" });
    } catch (err) {
        console.error('Appreciate error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 2. REMOVE APPRECIATION ---
// Route: DELETE /api/v1/appreciations/:appreciator_id/:portfolio_item_id
router.delete('/:appreciator_id/:portfolio_item_id', async (req, res) => {
    try {
        const { appreciator_id, portfolio_item_id } = req.params;

        const { error } = await supabase
            .from('appreciations')
            .delete()
            .match({ appreciator_id, portfolio_item_id });

        if (error) throw error;

        res.status(200).json({ message: "Removed" });
    } catch (err) {
        console.error('Remove appreciate error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 3. GET PHOTOGRAPHER TOTAL APPRECIATIONS ---
// Route: GET /api/v1/appreciations/count/:photographer_id
router.get('/count/:photographer_id', async (req, res) => {
    try {
        const { photographer_id } = req.params;

        const { count, error } = await supabase
            .from('appreciations')
            .select('*', { count: 'exact', head: true })
            .eq('photographer_id', photographer_id);

        if (error) throw error;

        res.status(200).json({ count: count || 0 });
    } catch (err) {
        console.error('Count appreciate error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 4. GET USER'S APPRECIATED ITEMS ---
// Route: GET /api/v1/appreciations/user/:appreciator_id
router.get('/user/:appreciator_id', async (req, res) => {
    try {
        const { appreciator_id } = req.params;

        const { data, error } = await supabase
            .from('appreciations')
            .select('portfolio_item_id')
            .eq('appreciator_id', appreciator_id);

        if (error) throw error;

        const itemIds = data.map(row => row.portfolio_item_id);
        res.status(200).json(itemIds);
    } catch (err) {
        console.error('User appreciations fetch error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- 5. BATCH GET APPRECIATION COUNTS FOR ITEMS ---
// Route: POST /api/v1/appreciations/counts/batch
router.post('/counts/batch', async (req, res) => {
    try {
        const { portfolio_item_ids } = req.body;

        if (!portfolio_item_ids || !Array.isArray(portfolio_item_ids) || portfolio_item_ids.length === 0) {
            return res.status(200).json({});
        }

        // Supabase/PostgREST doesn't support GROUP BY easily without RPC. 
        // We'll fetch all matching rows and aggregate in Node.
        const { data, error } = await supabase
            .from('appreciations')
            .select('portfolio_item_id')
            .in('portfolio_item_id', portfolio_item_ids);

        if (error) throw error;

        const countsMap = {};
        
        // Initialize with 0
        portfolio_item_ids.forEach(id => countsMap[id] = 0);
        
        // Populate counts
        if (data) {
            data.forEach(row => {
                if (countsMap[row.portfolio_item_id] !== undefined) {
                    countsMap[row.portfolio_item_id]++;
                }
            });
        }

        res.status(200).json(countsMap);
    } catch (err) {
        console.error('Batch count error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
