const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- HELPER: Jaccard Similarity ---
const calculateSkillMatch = (userSkills, otherSkills) => {
    const uSkills = userSkills || [];
    const oSkills = otherSkills || [];
    if (uSkills.length === 0 || oSkills.length === 0) return 0;

    const setA = new Set(uSkills.map(s => s.toLowerCase().trim()));
    const setB = new Set(oSkills.map(s => s.toLowerCase().trim()));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    if (union.size === 0) return 0;
    return Math.round((intersection.size / union.size) * 100);
};

// --- GET /api/v1/recommendations/peers ---
router.get('/peers', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'Missing userId' });

        // 1. Fetch Current User
        const { data: currentUser, error: userError } = await supabase
            .from('profiles')
            .select('skills, location, user_type')
            .eq('user_id', userId)
            .single();

        if (userError || !currentUser) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        // 2. Fetch Candidates
        const { data: candidates, error: listError } = await supabase
            .from('profiles')
            .select('user_id, full_name, user_type, location, skills, avatar_url, is_verified')
            .neq('user_id', userId); // Exclude self

        if (listError) throw listError;

        // 3. Run Scoring
        let scoredResults = candidates.map(candidate => {
            let score = 0;
            const hasSkills = currentUser.skills && currentUser.skills.length > 0;
            
            const skillScore = calculateSkillMatch(currentUser.skills, candidate.skills);
            
            const userLoc = currentUser.location ? currentUser.location.toLowerCase().trim() : "";
            const candLoc = candidate.location ? candidate.location.toLowerCase().trim() : "";
            const locationMatch = (userLoc && candLoc && userLoc === candLoc);

            if (hasSkills) {
                // Skills available? Use them.
                score = (skillScore * 0.7) + (locationMatch ? 30 : 0);
            } else {
                // No skills? Fallback to location only.
                score = locationMatch ? 50 : 0; 
            }
            
            // Tiny boost for verified users (Tie-breaker)
            if (candidate.is_verified) score += 5;

            return {
                id: candidate.user_id,
                name: candidate.full_name || "Anonymous",
                role: candidate.user_type,
                location: candidate.location || "Remote",
                avatar: candidate.avatar_url,
                match: Math.min(Math.round(score), 100)
            };
        });

        // 4. THE FAIL-SAFE SORTING
        // Instead of filtering out 0s, we just sort by score descending.
        // If everyone is 0, we still return them (just with 0% match shown, or we can hide the pill).
        
        let topMatches = scoredResults
            .sort((a, b) => b.match - a.match)
            .slice(0, 6);

        // 5. EMERGENCY FALLBACK
        // If somehow we have 0 matches (e.g. database empty), return empty array
        // But if we have candidates with 0 score, we STILL return them so UI isn't empty.
        
        res.status(200).json(topMatches);

    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;