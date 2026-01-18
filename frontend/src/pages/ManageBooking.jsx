import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api'; // Import your Axios Service
import { toast } from '../components/Toaster'; // Assuming you have a toaster
import { Loader2 } from 'lucide-react'; // Icon for loading state
import './ManageBooking.css'; 

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    // 1. FETCH REAL BOOKINGS
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Get Provider ID from Local Storage
                const providerId = localStorage.getItem('user_id');
                
                if (!providerId) {
                    toast.error("You must be logged in to manage bookings.");
                    return;
                }

                // Call the Backend Route we created
                // GET /api/v1/bookings/manage?providerId=...
                const response = await api.get(`/bookings/manage?providerId=${providerId}`);
                
                // The backend already formats the data correctly (client_name, listing_title, etc.)
                setBookings(response.data);

            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // 2. FILTERING LOGIC (Frontend Side)
    // Since we fetch all bookings, we can filter them here instantly
    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'upcoming') {
            // Show Confirmed jobs that are happening in the future (optional date check could go here)
            return b.status === 'confirmed'; 
        }
        return b.status === activeTab;
    });

    // Helper: Format Dates
    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return `${dateStr} • ${startTime} - ${endTime}`;
    };

    // 3. HANDLE STATUS UPDATES (Accept/Decline)
    const handleStatusUpdate = async (bookingId, newStatus) => {
        // Optimistic UI Update: Update list immediately before server responds
        const previousBookings = [...bookings];
        
        // Update local state instantly so UI feels fast
        setBookings(prev => prev.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        ));

        try {
            const providerId = localStorage.getItem('user_id');

            // Call Backend: PATCH /api/v1/bookings/:id/status
            await api.patch(`/bookings/${bookingId}/status`, {
                status: newStatus,
                providerId: providerId // Security check
            });

            toast.success(`Booking ${newStatus} successfully!`);

        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update status.");
            // Revert changes if server fails
            setBookings(previousBookings);
        }
    };

    if (loading) {
        return (
            <div className="manage-page" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Loader2 className="animate-spin" size={48} color="#7c3aed" />
            </div>
        );
    }

    return (
        <div className="manage-page">
            <Navbar />
            
            <div className="manage-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Bookings</h1>
                        <p className="page-subtitle">Track your upcoming shoots and payments</p>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="tabs-container">
                    <button 
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Jobs
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        History
                    </button>
                </div>

                {/* --- BOOKING LIST --- */}
                <div className="bookings-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <p>No {activeTab} bookings found.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                
                                <div className="booking-info">
                                    <div className="card-top-row">
                                        <h3>{booking.listing_title || "Untitled Booking"}</h3>
                                        <div className="badges">
                                            {/* Status Badge */}
                                            <span className={`status-badge status-${booking.status}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                            {/* Payment Badge */}
                                            <span className={`status-badge payment-${booking.payment_status}`}>
                                                {booking.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="client-name">Client: {booking.client_name}</p>
                                    
                                    <p className="booking-details">
                                        📅 {formatTimeRange(booking.start_time, booking.end_time)}
                                    </p>
                                    
                                    <p className="booking-price">
                                        💰 Total: ${booking.total_price.toFixed(2)}
                                    </p>
                                    
                                    {booking.special_requirements && (
                                        <div className="message-box">
                                            <span className="note-label">Note:</span> "{booking.special_requirements}"
                                        </div>
                                    )}
                                </div>

                                <div className="actions">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button 
                                                className="btn-accept"
                                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                            >
                                                Accept Request
                                            </button>
                                            <button 
                                                className="btn-decline"
                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {booking.status === 'confirmed' && (
                                        <button 
                                            className="btn-complete"
                                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}

                                    {booking.status === 'completed' && (
                                        <span className="completion-text">
                                            ✓ Job Done
                                        </span>
                                    )}
                                     
                                    {/* Handle Cancelled State UI */}
                                    {booking.status === 'cancelled' && (
                                        <span style={{color: '#ef4444', fontWeight: 'bold', alignSelf:'center'}}>
                                            ✕ Declined
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;