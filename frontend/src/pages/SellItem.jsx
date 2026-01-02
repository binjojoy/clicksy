import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import './SellItem.css';

const SellItem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',        
        price: '',
        location: '',
        description: '',
        // 🔴 FIX 1: Must match DB Enum exactly ("For Sale")
        listing_type: 'For Sale', 
        rent_period: 'daily' // Check if DB expects 'Day' or 'day'. Usually Capitalized if Enum.
    });

    // 1. CHECK LOCAL STORAGE
    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            alert("You must be logged in to list an item.");
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (type) => {
        setFormData({ ...formData, listing_type: type });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !formData.name || !formData.price) {
            alert("Please provide an image, name, and price.");
            return;
        }

        try {
            setLoading(true);

            // 2. SMART USER ID LOGIC
            let finalUserId;
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                finalUserId = user.id;
            } else {
                // Guest ID fallback
                finalUserId = "00000000-0000-0000-0000-000000000000"; 
            }

            // 3. UPLOAD IMAGE
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `listings/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('marketplace')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('marketplace')
                .getPublicUrl(filePath);

            // 4. INSERT INTO DB
            // 🔴 FIX 2: check for 'For Rent' string
            const rentPeriodValue = formData.listing_type === 'For Rent' ? formData.rent_period : null;

            const { error: dbError } = await supabase
                .from('listings')
                .insert([
                    {
                        user_id: finalUserId, 
                        name: formData.name,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        location: formData.location,
                        listing_type: formData.listing_type, // Now sends "For Sale" or "For Rent"
                        rent_period: rentPeriodValue,       
                        image_url: publicUrl,
                        currency: 'USD',
                        status: 'active'
                    }
                ]);

            if (dbError) throw dbError;

            alert("Item listed successfully!");
            navigate('/dashboard'); 

        } catch (error) {
            console.error('Error:', error);
            alert("Listing failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sell-page">
            <Navbar />
            <div className="sell-container">
                <div className="sell-card">
                    <div className="sell-header">
                        <h1 className="sell-title">List an Item</h1>
                        <p className="sell-subtitle">Turn your gear into cash or rent it out</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Item Name</label>
                            <input name="name" type="text" className="form-input" placeholder="e.g. Sony A7 III Body" onChange={handleChange} required disabled={loading} />
                        </div>

                        {/* Type & Price */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Listing Type</label>
                                <div className="type-toggle">
                                    {/* 🔴 FIX 3: Updated Buttons to send "For Sale" / "For Rent" */}
                                    <button 
                                        type="button" 
                                        className={`toggle-btn ${formData.listing_type === 'For Sale' ? 'active' : ''}`} 
                                        onClick={() => handleTypeChange('For Sale')} 
                                        disabled={loading}
                                    >
                                        For Sale
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`toggle-btn ${formData.listing_type === 'For Rent' ? 'active' : ''}`} 
                                        onClick={() => handleTypeChange('For Rent')} 
                                        disabled={loading}
                                    >
                                        For Rent
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Price ($)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input name="price" type="number" className="form-input" placeholder="0.00" onChange={handleChange} required disabled={loading} />
                                    {/* 🔴 FIX 4: Updated Conditional Check */}
                                    {formData.listing_type === 'For Rent' && (
                                        <select name="rent_period" className="form-select" style={{ width: '100px' }} onChange={handleChange} value={formData.rent_period} disabled={loading}>
                                            <option value="daily">/ Day</option>
                                            <option value="weekly">/ Week</option>
                                            <option value="hourly">/ Hour</option>
                                            <option value="monthly">/ Month</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input name="location" type="text" className="form-input" placeholder="e.g. New York" onChange={handleChange} required disabled={loading} />
                        </div>

                        {/* Image */}
                        <div className="form-group">
                            <label className="form-label">Photo</label>
                            <div className="image-upload-area">
                                <input type="file" accept="image/*" className="hidden-input" onChange={handleFileChange} disabled={loading} />
                                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
                                    {file ? `Selected: ${file.name}` : "Click to upload photos"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" rows="4" className="form-textarea" placeholder="Details..." onChange={handleChange} disabled={loading}></textarea>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Publishing...' : 'Post Listing'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellItem;