const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- GET /api/v1/bookings/manage ---
// Usage: http://localhost:5000/api/v1/bookings/manage?providerId=YOUR_UUID
router.get('/manage', async (req, res) => {
    try {
        const { providerId } = req.query;

        if (!providerId) {
            return res.status(400).json({ error: 'Missing providerId query parameter' });
        }

        console.log(`Fetching bookings for provider: ${providerId}`);

        // 1. Fetch Bookings (Simple fetch, no joins)
        const { data: bookings, error: bookingError } = await supabase
            .from('bookings')
            .select('*') 
            .eq('provider_id', providerId)
            .order('created_at', { ascending: false });

        if (bookingError) throw bookingError;

        // If empty, return immediately
        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Fetch Client Names from Profiles
        const clientIds = [...new Set(bookings.map(b => b.client_id))];

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', clientIds);

        if (profileError) throw profileError;

        // 3. Create a Lookup Map (ID -> Profile)
        const profileMap = {};
        if (profiles) {
            profiles.forEach(p => {
                profileMap[p.user_id] = p;
            });
        }

        // 4. Attach names to bookings
        const formattedBookings = bookings.map(b => {
            const clientProfile = profileMap[b.client_id] || {};
            
            return {
                ...b,
                // Client Info
                client_name: clientProfile.full_name || 'Unknown Client', 
                client_avatar: clientProfile.avatar_url || null,
                
                // Redundancy: Ensure listing_title exists for frontend compatibility
                listing_title: b.booking_title 
            };
        });

        res.status(200).json(formattedBookings);

    } catch (err) {
        console.error('Server Error fetching bookings:', err.message);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
});

// --- PATCH /api/v1/bookings/:id/status ---
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, providerId } = req.body; 

    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: status })
            .eq('id', id)
            .eq('provider_id', providerId)
            .select();

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(data[0]);

    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;