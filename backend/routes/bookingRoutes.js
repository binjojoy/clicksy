const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// --- POST /api/v1/bookings ---
// --- POST /api/v1/bookings ---
router.post('/', async (req, res) => {
    try {
        const { 
            client_id, 
            provider_id, 
            booking_title, 
            start_time, 
            end_time, 
            total_price, 
            special_requirements 
        } = req.body;

        // 1. Insert the Booking record
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                client_id,
                provider_id,
                booking_title,
                start_time,
                end_time,
                total_price,
                special_requirements,
                status: 'pending',
                payment_status: 'pending'
            }])
            .select()
            .single();

        if (bookingError) throw bookingError;

        // --- ⚡ START NOTIFICATION TRIGGER ⚡ ---
        // Fetch profiles to get names for the notification content
        const { data: clientProfile } = await supabase.from('profiles').select('full_name').eq('user_id', client_id).single();
        const { data: providerProfile } = await supabase.from('profiles').select('full_name').eq('user_id', provider_id).single();

        // A. Notify the Provider (Photographer) - "You have a new request"
        await supabase.from('notifications').insert({
            user_id: provider_id,
            type: 'booking',
            title: 'New Booking Request',
            content: `${clientProfile?.full_name || 'A client'} requested a session: "${booking_title}"`,
            related_id: booking.id // Link to the specific booking ID
        });

        // B. Notify the Client - "Your request was sent"
        await supabase.from('notifications').insert({
            user_id: client_id,
            type: 'booking',
            title: 'Booking Sent',
            content: `Your request for "${booking_title}" has been sent to ${providerProfile?.full_name || 'the photographer'}.`,
            related_id: booking.id
        });
        // --- ⚡ END NOTIFICATION TRIGGER ⚡ ---

        res.status(201).json(booking);

    } catch (err) {
        console.error('Booking Notification Error:', err.message);
        res.status(500).json({ error: 'Failed to create booking or notification' });
    }
});

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
        // 1. Update the booking and select the result so we have the client_id and title
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

        const updatedBooking = data[0];

        // --- ⚡ START NOTIFICATION TRIGGER ⚡ ---
        // A. Fetch the photographer's name to make the notification readable
        const { data: providerProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', providerId)
            .single();

        // B. Insert the notification for the client
        await supabase.from('notifications').insert({
            user_id: updatedBooking.client_id, // The Client receives this
            type: 'booking',
            title: 'Booking Update',
            content: `${providerProfile?.full_name || 'The photographer'} updated your "${updatedBooking.booking_title}" status to ${status}.`,
            related_id: id // Links back to this specific booking
        });
        // --- ⚡ END NOTIFICATION TRIGGER ⚡ ---

        res.status(200).json(updatedBooking);

    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- GET UPCOMING BOOKINGS FOR DASHBOARD (User as Client OR Provider) ---
// Usage: GET /api/v1/bookings/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch bookings where user is EITHER client OR provider
        // AND start_time is in the future (Upcoming)
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .or(`client_id.eq.${userId},provider_id.eq.${userId}`) // OR logic
            .gte('start_time', new Date().toISOString()) // Future bookings only
            .order('start_time', { ascending: true }) // Soonest first
            .limit(5); // Only get top 5 for the dashboard

        if (error) throw error;

        res.status(200).json(bookings);

    } catch (err) {
        console.error('Error fetching dashboard bookings:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- GET /api/v1/bookings/client-dashboard/:userId ---
// Fetches total booking count and the single next upcoming booking with photographer details
router.get('/client-dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Get TOTAL count of all bookings for this client (for the stat card)
        const { count, error: countError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', userId);

        if (countError) throw countError;

        // 2. Get the SINGLE next upcoming booking
        const { data: nextBookingData, error: nextBookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('client_id', userId)
            .gte('start_time', new Date().toISOString()) // Only future bookings
            .order('start_time', { ascending: true })    // Closest date first
            .limit(1)
            .single(); // Returns an object instead of an array, or null if none

        // If there's no upcoming booking, return the count and null for nextBooking
        if (!nextBookingData || nextBookingError) {
            return res.status(200).json({
                totalBookings: count || 0,
                nextBooking: null
            });
        }

        // 3. Fetch the Photographer's Profile (to get their name)
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', nextBookingData.provider_id)
            .single();

        if (profileError) console.error("Error fetching provider profile:", profileError);

        // 4. Format and send the response
        res.status(200).json({
            totalBookings: count || 0,
            nextBooking: {
                ...nextBookingData,
                photographer_name: profileData?.full_name || 'Unknown Photographer',
                photographer_avatar: profileData?.avatar_url || null
            }
        });

    } catch (err) {
        console.error('Error fetching client dashboard bookings:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- GET /api/v1/bookings/client/:userId ---
// Fetches all bookings for a client with photographer names and avatars
router.get('/client/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Fetch bookings
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('client_id', userId)
            .order('start_time', { ascending: false });

        if (error) throw error;

        // 2. Fetch photographer profiles
        const providerIds = [...new Set(bookings.map(b => b.provider_id))];
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', providerIds);

        const profileMap = {};
        profiles?.forEach(p => profileMap[p.user_id] = p);

        // 3. Combine data
        const enrichedBookings = bookings.map(b => ({
            ...b,
            photographer_name: profileMap[b.provider_id]?.full_name || "Unknown Photographer",
            photographer_avatar: profileMap[b.provider_id]?.avatar_url || null
        }));

        res.status(200).json(enrichedBookings);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;