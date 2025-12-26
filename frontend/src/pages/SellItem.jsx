import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './SellItem.css';

const SellItem = () => {
    const [formData, setFormData] = useState({
        name: '',        // Changed from 'title' to match DB 'name'
        price: '',
        location: '',
        description: '',
        listing_type: 'sale', // Changed from 'type' to match DB 'listing_type'
        rent_period: 'day'    // NEW: Needed because your DB has this column
    });
    
    const [file, setFile] = useState(null);

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

        // ---------------------------------------------------------
        // 🔮 FUTURE BACKEND CONNECTION LOGIC
        // ---------------------------------------------------------
        // 1. Upload 'file' to Supabase Storage -> Get 'publicUrl'
        // 2. Send 'formData' + 'publicUrl' to your backend
        
        // Simulating the data payload that matches your Schema:
        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            listing_type: formData.listing_type, // 'sale' or 'rent'
            rent_period: formData.listing_type === 'rent' ? formData.rent_period : null,
            location: formData.location,
            description: formData.description,
            // image_url: publicUrl 
        };

        console.log("Ready to send to DB:", payload);
        alert(`Listing Ready!\nName: ${payload.name}\nPrice: ${payload.price}\nType: ${payload.listing_type}`);
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
                        
                        {/* 1. Item Name */}
                        <div className="form-group">
                            <label className="form-label">Item Name</label>
                            <input 
                                type="text" name="name" required
                                className="form-input" 
                                placeholder="e.g. Sony A7 III Body"
                                onChange={handleChange}
                            />
                        </div>

                        {/* 2. Type & Price */}
                        <div className="form-grid">
                            
                            {/* Sale vs Rent Toggle */}
                            <div className="form-group">
                                <label className="form-label">Listing Type</label>
                                <div className="type-toggle">
                                    <button 
                                        type="button"
                                        className={`toggle-btn ${formData.listing_type === 'sale' ? 'active' : ''}`}
                                        onClick={() => handleTypeChange('sale')}
                                    >
                                        For Sale
                                    </button>
                                    <button 
                                        type="button"
                                        className={`toggle-btn ${formData.listing_type === 'rent' ? 'active' : ''}`}
                                        onClick={() => handleTypeChange('rent')}
                                    >
                                        For Rent
                                    </button>
                                </div>
                            </div>

                            {/* Price Input */}
                            <div className="form-group">
                                <label className="form-label">
                                    {formData.listing_type === 'sale' ? 'Selling Price ($)' : 'Rent Price ($)'}
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="number" name="price" required
                                        className="form-input" 
                                        placeholder="0.00"
                                        onChange={handleChange}
                                    />
                                    {/* Show Period dropdown only if Renting */}
                                    {formData.listing_type === 'rent' && (
                                        <select 
                                            name="rent_period" 
                                            className="form-select" 
                                            style={{ width: '100px' }}
                                            onChange={handleChange}
                                        >
                                            <option value="day">/ Day</option>
                                            <option value="week">/ Week</option>
                                            <option value="hour">/ Hour</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Location */}
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input 
                                type="text" name="location" required
                                className="form-input" 
                                placeholder="e.g. Downtown, New York"
                                onChange={handleChange}
                            />
                        </div>

                        {/* 4. Image Upload */}
                        <div className="form-group">
                            <label className="form-label">Photos</label>
                            <div className="image-upload-area">
                                <input type="file" accept="image/*" className="hidden-input" onChange={handleFileChange} />
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#a1a1aa', marginBottom: '10px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                                    {file ? `Selected: ${file.name}` : "Click to upload photos"}
                                </p>
                            </div>
                        </div>

                        {/* 5. Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                name="description" rows="4" 
                                className="form-textarea" 
                                placeholder="Like new condition. Includes battery and charger..."
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-submit">
                            Post Listing
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellItem;