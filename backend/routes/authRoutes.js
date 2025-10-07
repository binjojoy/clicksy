// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); // Import our Supabase client

// You will need a 'routes' folder: mkdir backend/routes

// --- POST /api/v1/auth/register ---
// Handles user registration (Client or Photographer)
router.post('/register', async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
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
            // Handle specific errors like "User already exists"
            return res.status(400).json({ error: signUpError.message });
        }

        const userId = userData.user.id;
        
        // 2. Insert into our custom 'profiles' table to store userType
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                { user_id: userId, user_type: userType, email: email }
            ]);
        
        if (profileError) {
            // NOTE: In a real app, you would need to delete the user created in step 1 if step 2 fails (transaction logic)
            console.error("Profile Insert Error:", profileError.message);
            return res.status(500).json({ error: 'Registration failed during profile creation.' });
        }

        // Supabase sends a confirmation email by default
        return res.status(201).json({ 
            message: 'Registration successful. Check your email for a confirmation link!',
            user: { id: userId, email: email, userType: userType }
        });

    } catch (err) {
        console.error('Server error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- POST /api/v1/auth/login ---
// Handles user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // 1. Supabase Login (returns session and user info)
        const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            console.error("Supabase Sign-In Error:", signInError.message);
            return res.status(401).json({ error: 'Invalid credentials or user not verified.' });
        }
        
        // 2. Fetch the custom profile (to get userType)
        const userId = loginData.user.id;
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('user_id', userId)
            .single();

        if (profileError || !profileData) {
             console.error("Profile Fetch Error:", profileError);
             return res.status(500).json({ error: 'Could not retrieve user profile.' });
        }

        // IMPORTANT: In a production app, you would set the JWT (loginData.session.access_token) 
        // as a secure HttpOnly cookie here to maintain the session.

        res.status(200).json({
            message: 'Login successful',
            user: { 
                id: userId, 
                email: loginData.user.email,
                userType: profileData.user_type,
                token: loginData.session.access_token // Send token back for now (to be stored in cookie later)
            },
        });

    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;