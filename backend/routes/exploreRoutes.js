const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- HELPER: Jaccard Similarity (Skill Alignment) ---
const getJaccardScore = (userSkills, candSkills) => {
    // FIX: Explicitly check for arrays to prevent .length errors on null fields
    const u = Array.isArray(userSkills) ? userSkills : [];
    const c = Array.isArray(candSkills) ? candSkills : [];
    if (u.length === 0 || c.length === 0) return 0;
    
    const setA = new Set(u.map(s => s.toLowerCase().trim()));
    const setB = new Set(c.map(s => s.toLowerCase().trim()));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    
    return union.size === 0 ? 0 : (intersection.size / union.size);
};

// --- GET /api/v1/explore/dynamic ---
router.get('/dynamic', async (req, res) => {
    try {
        const { userId, budget = 5000 } = req.query;

        const [{ data: user }, { data: pgs }] = await Promise.all([
            supabase.from('profiles').select('skills').eq('user_id', userId).maybeSingle(),
            // FIX: .ilike handles the capitalized "Photographer" in your database
            supabase.from('profiles').select('*').ilike('user_type', 'photographer').limit(30)
        ]);

        if (!pgs || pgs.length === 0) return res.status(200).json([]);

        // Filter self if userId is present (prevents seeing your own card)
        const finalCandidates = userId ? pgs.filter(p => p.user_id !== userId) : pgs;

        const scored = finalCandidates.map(pg => {
            // Original Skill/Match logic preserved exactly
            const skillScore = (user && user.skills) ? getJaccardScore(user.skills, pg.skills) : 0;
            const priceDist = Math.abs(budget - (pg.hourly_rate || 2000)) / 1000;
            const priceScore = 1 / (priceDist + 1);
            
            // Proximity weighting (60/40 vs 100% fallback)
            const totalScore = (user && user.skills) ? (skillScore * 60) + (priceScore * 40) : (priceScore * 100);

            return {
                ...pg,
                match_score: Math.round(totalScore) || 0, 
                id: pg.user_id,
                name: pg.full_name || "Anonymous Pro",
                image: pg.avatar_url || "https://via.placeholder.com/400",
                price_display: pg.hourly_rate ? `₹${Math.round(pg.hourly_rate)}/hr` : 'Contact'
            };
        });

        res.status(200).json(scored.sort((a, b) => b.match_score - a.match_score));
    } catch (err) {
        console.error("Explore Error:", err);
        res.status(200).json([]); // Always return array to avoid frontend crashes
    }
});

// --- GET /api/v1/explore/inspiration ---
router.get('/inspiration', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('portfolio_items')
            .select(`
                id, 
                title, 
                media_url, 
                category, 
                profiles(full_name, avatar_url)
            `) // FIX: Removed !inner to stop 500 crashes
            .order('created_at', { ascending: false })
            .limit(15);

        if (error) throw error;

        res.status(200).json(data.map(item => ({
            id: item.id,
            title: item.title || "Untitled Work",
            image: item.media_url,
            category: item.category || "General",
            photographer: item.profiles?.full_name || "Creator",
            avatar: item.profiles?.avatar_url
        })));
    } catch (err) {
        console.error("Inspiration Feed Error:", err);
        res.status(500).json({ error: "Failed to load feed" });
    }
});

module.exports = router;