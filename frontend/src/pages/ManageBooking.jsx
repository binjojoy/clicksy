import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './ManageBooking.css'; 

const ManageBookings = () => {
    // 💡 DUMMY DATA: Now structured exactly like your Supabase 'bookings' table
    // Note: In the real app, 'client_name' and 'listing_title' will come from Joins (foreign keys)
    const [bookings, setBookings] = useState([
        {
            id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
            created_at: "2025-10-01T10:00:00Z",
            start_time: "2025-10-15T09:00:00Z",
            end_time: "2025-10-15T17:00:00Z",
            total_price: 1200.00,
            status: "pending", // matches public.booking_status
            payment_status: "pending", // matches public.payment_status
            special_requirements: "We need a photographer for 8 hours at City Hall. Please bring backup lighting.",
            
            // These fields simulate the Foreign Key data we will fetch later
            client_name: "Alice Johnson",
            listing_title: "Full Day Wedding Package"
        },
        {
            id: "a123f1ee-6c54-4b01-90e6-d701748f0852",
            created_at: "2025-09-10T14:30:00Z",
            start_time: "2025-09-20T10:00:00Z",
            end_time: "2025-09-20T12:00:00Z",
            total_price: 300.00,
            status: "confirmed",
            payment_status: "paid",
            special_requirements: "Headshots for 10 employees. White background needed.",
            
            client_name: "TechCorp Inc.",
            listing_title: "Corporate Headshots"
        },
        {
            id: "b456f1ee-6c54-4b01-90e6-d701748f0853",
            created_at: "2025-08-01T09:00:00Z",
            start_time: "2025-08-05T16:00:00Z",
            end_time: "2025-08-05T18:00:00Z",
            total_price: 250.00,
            status: "completed",
            payment_status: "paid",
            special_requirements: "Outdoor shoot at the park. Natural light only.",
            
            client_name: "Mark Smith",
            listing_title: "Golden Hour Portrait Session"
        }
    ]);

    const [activeTab, setActiveTab] = useState('pending');

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'upcoming') return b.status === 'confirmed';
        return b.status === activeTab;
    });

    // Helper to format timestamps (e.g., "Oct 15, 2025 • 9:00 AM - 5:00 PM")
    const formatTimeRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        const dateStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return `${dateStr} • ${startTime} - ${endTime}`;
    };

    const updateStatus = (id, newStatus) => {
        if (newStatus === 'cancelled') {
            setBookings(bookings.filter(b => b.id !== id));
        } else {
            setBookings(bookings.map(b => 
                b.id === id ? { ...b, status: newStatus } : b
            ));
        }
    };

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
                            <p>No bookings found in this section.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                
                                <div className="booking-info">
                                    <div className="card-top-row">
                                        <h3>{booking.listing_title}</h3>
                                        <div className="badges">
                                            {/* Booking Status Badge */}
                                            <span className={`status-badge status-${booking.status}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                            {/* Payment Status Badge (New!) */}
                                            <span className={`status-badge payment-${booking.payment_status}`}>
                                                {booking.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="client-name">Client: {booking.client_name}</p>
                                    
                                    {/* Formatted Date Range */}
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
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                            >
                                                Accept Request
                                            </button>
                                            <button 
                                                className="btn-decline"
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {booking.status === 'confirmed' && (
                                        <button 
                                            className="btn-complete"
                                            onClick={() => updateStatus(booking.id, 'completed')}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}

                                    {booking.status === 'completed' && (
                                        <span className="completion-text">
                                            ✓ Job Done
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