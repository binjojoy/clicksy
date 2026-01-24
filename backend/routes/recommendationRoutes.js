const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- HELPER: Jaccard Similarity ---
const calculateSkillMatch = (userSkills, otherSkills) => {
    // Safety Check: If skills are missing/null, treat as empty array
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
        
        console.log(`\n--- 🔍 DEBUG RECOMMENDATION START ---`);
        console.log(`1. Incoming Request for User ID: ${userId}`);

        if (!userId) {
            console.log("❌ Error: Missing User ID");
            return res.status(400).json({ error: 'Missing userId' });
        }

        // 1. Fetch Current User
        const { data: currentUser, error: userError } = await supabase
            .from('profiles')
            .select('skills, location, user_type')
            .eq('user_id', userId)
            .single();

        if (userError || !currentUser) {
            console.log("❌ Error: Current User Profile Not Found in DB.");
            console.log("Supabase Error:", userError);
            return res.status(404).json({ error: 'User profile not found' });
        }

        console.log("2. Current User Found:", { 
            loc: currentUser.location, 
            skills: currentUser.skills 
        });

        // 2. Fetch Candidates
        const { data: candidates, error: listError } = await supabase
            .from('profiles')
            .select('user_id, full_name, user_type, location, skills, avatar_url, is_verified')
            .neq('user_id', userId);

        if (listError) {
            console.log("❌ Error fetching candidates:", listError);
            throw listError;
        }

        console.log(`3. Found ${candidates.length} potential candidates.`);

        // 3. Run Algorithm
        const scoredResults = candidates.map(candidate => {
            let score = 0;
            const hasSkills = currentUser.skills && currentUser.skills.length > 0;
            
            // Skill Score
            const skillScore = calculateSkillMatch(currentUser.skills, candidate.skills);
            
            // Location Score
            const userLoc = currentUser.location ? currentUser.location.toLowerCase().trim() : "";
            const candLoc = candidate.location ? candidate.location.toLowerCase().trim() : "";
            const locationMatch = (userLoc && candLoc && userLoc === candLoc);

            // Logic Switch
            if (hasSkills) {
                // 70% Skills + 30% Location
                score = (skillScore * 0.7) + (locationMatch ? 30 : 0);
            } else {
                // Fallback: 85% for Location, 10% base
                score = locationMatch ? 85 : 10;
            }
            
            if (candidate.is_verified) score += 5;

            // Debug specific matches to see why they fail/succeed
            if (score > 0) {
                console.log(`   -> Matched ${candidate.full_name}: ${Math.round(score)}% (Loc: ${locationMatch}, Skill: ${skillScore}%)`);
            }

            return {
                id: candidate.user_id,
                name: candidate.full_name || "Anonymous",
                role: candidate.user_type,
                location: candidate.location || "Remote",
                avatar: candidate.avatar_url,
                match: Math.min(Math.round(score), 100)
            };
        });

        // 4. Sort & Return
        const topMatches = scoredResults
            .filter(item => item.match > 0) // Only return non-zero matches
            .sort((a, b) => b.match - a.match)
            .slice(0, 6);

        console.log(`4. Returning ${topMatches.length} final matches.`);
        console.log(`--- DEBUG END ---\n`);

        res.status(200).json(topMatches);

    } catch (err) {
        console.error('❌ SERVER ERROR:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;