// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); // Import our Supabase client

// You will need a 'routes' folder: mkdir backend/routes

// ---------------------------------------------------------------------
// --- POST /api/v1/auth/register ---
// ---------------------------------------------------------------------
router.post('/register', async (req, res) => {
    // 💡 LOG: Start of Request
    console.log("--- REGISTER REQUEST RECEIVED ---");
    const { email, password, userType } = req.body;
    // 💡 LOG: Input data
    console.log(`Input: Email: ${email}, User Type: ${userType}`);

    if (!email || !password || !userType) {
        console.error("REGISTER FAILED: Missing required fields.");
        return res.status(400).json({ error: 'Email, password, and user type are required.' });
    }

    try {
        // 1. Supabase User Signup (creates entry in auth.users)
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });

        if (signUpError) {
            console.error("Supabase Signup Error:", signUpError.message);
            return res.status(400).json({ error: signUpError.message });
        }

        const userId = userData.user.id;
        // 💡 LOG: Supabase Auth Success
        console.log(`[SUCCESS] Supabase Auth User Created. ID: ${userId}`); 
        
        // 2. Insert into our custom 'profiles' table to store userType
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                { user_id: userId, user_type: userType, email: email }
            ]);
        
        if (profileError) {
            // 💡 LOG: Profile Insert Failure
            console.error("Profile Insert Error (Rollback required):", profileError.message); 
            return res.status(500).json({ error: 'Registration failed during profile creation.' });
        }

        // 💡 LOG: Profile Insert Success
        console.log(`[SUCCESS] Profile Inserted for user: ${userId}`); 

        return res.status(201).json({ 
            message: 'Registration successful. Check your email for a confirmation link!',
            user: { id: userId, email: email, userType: userType }
        });

    } catch (err) {
        // 💡 LOG: Unexpected Server Error
        console.error('Server error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        console.log("--- REGISTER REQUEST END ---\n"); // 💡 LOG: End of Request
    }
});

// ---------------------------------------------------------------------
// --- POST /api/v1/auth/login ---
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// --- POST /api/v1/auth/login ---
// ---------------------------------------------------------------------
router.post('/login', async (req, res) => {
    console.log("--- LOGIN REQUEST RECEIVED ---");
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // 1. Authenticate with Supabase Auth
        const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error("Supabase Sign-In Error:", signInError.message);
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const userId = loginData.user.id;
        
        // 2. Fetch the Full Name from the 'profiles' table
        // We specifically select 'full_name' here
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, user_type') // We fetch both so you have them, but Name is the priority
            .eq('user_id', userId)
            .single();

        if (profileError || !profileData) {
            console.error("Profile Fetch Error:", profileError);
            // Fallback: If no profile exists yet, we don't block login, but return null for name
            return res.status(200).json({
                message: 'Login successful (Profile missing)',
                user: { 
                    id: userId, 
                    email: loginData.user.email,
                    fullName: "User", // Default fallback
                    token: loginData.session.access_token 
                },
            });
        }

        // 3. Send back the extracted Full Name
        console.log(`[SUCCESS] User logged in: ${profileData.full_name}`);

        res.status(200).json({
            message: 'Login successful',
            user: { 
                id: userId, 
                email: loginData.user.email,
                // 👇 THIS IS THE KEY EXTRACTED VALUE FOR YOUR DASHBOARD 👇
                fullName: profileData.full_name, 
                // We keep userType just in case you need it for permissions later
                userType: profileData.user_type,
                token: loginData.session.access_token 
            },
        });

    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;