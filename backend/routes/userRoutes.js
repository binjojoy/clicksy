// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- GET /api/v1/user/me ---
// Fetches the current authenticated user's profile and data
router.get('/me', async (req, res) => {
    
    // 1. Check for Authorization Header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("GET /me FAILED: Missing or malformed Authorization header.");
        return res.status(401).json({ error: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];
    
    let user;

    try {
        // 2. Verify the JWT with Supabase Auth
        const { data, error: authError } = await supabase.auth.getUser(token);

        if (authError || !data.user) {
            console.error("GET /me FAILED: Invalid token.", authError);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        user = data.user;
        const userId = user.id;
        console.log(`[SUCCESS] Token validated for User ID: ${userId}`);

        // 3. Fetch the custom profile data
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*') // Fetch all custom profile columns
            .eq('user_id', userId)
            .single();

        if (profileError) {
            console.error("Profile Fetch Error:", profileError);
            // NOTE: If no profile is found, return a 404/200 with minimal data depending on your app logic
            return res.status(404).json({ error: 'User profile not found in database.' });
        }

        // 4. Return the combined user data
        console.log(`[SUCCESS] Profile data retrieved for: ${user.email}`);
        res.status(200).json({
            id: user.id,
            email: user.email,
            ...profileData, // Spreads all custom fields (full_name, user_type, etc.)
        });

    } catch (err) {
        console.error('Server error fetching user data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;