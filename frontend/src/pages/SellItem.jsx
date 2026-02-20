import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { predictPriceKNN } from '../utils/knnPricePredictor'; // 1. Import the K-NN Algorithm
import '../styles/SellItem.css';

const SellItem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [predictedPrice, setPredictedPrice] = useState(null); // State for Smart Price

    // Form State
    const [formData, setFormData] = useState({
        name: '',        
        price: '',
        location: '',
        description: '',
        listing_type: 'For Sale', 
        rent_period: 'daily',
        
        // --- NEW FIELDS FOR ALGORITHM ---
        // Defaults ensure the algorithm has data to start with
        category: 'Camera Body',
        brand: 'Sony',
        condition: 'Good',
        purchaseYear: ''
    });

    // 1. CHECK AUTH
    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            alert("You must be logged in to list an item.");
            navigate('/login');
        }
    }, [navigate]);

    // 2. K-NN ALGORITHM TRIGGER
    // Automatically runs when Brand, Category, Condition, or Year changes
    useEffect(() => {
        if (formData.listing_type === 'For Sale' && formData.purchaseYear) {
            const estimate = predictPriceKNN({
                brand: formData.brand,
                category: formData.category,
                condition: formData.condition,
                purchaseYear: formData.purchaseYear
            });
            setPredictedPrice(estimate);
        } else {
            setPredictedPrice(null); // Clear if renting or missing year
        }
    }, [formData.purchaseYear, formData.condition, formData.category, formData.brand, formData.listing_type]);

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

            // SMART USER ID LOGIC
            let finalUserId;
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                finalUserId = user.id;
            } else {
                finalUserId = "00000000-0000-0000-0000-000000000000"; 
            }

            // UPLOAD IMAGE
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

            // INSERT INTO DB
            const rentPeriodValue = formData.listing_type === 'For Rent' ? formData.rent_period : null;

            // Combine extra details into description or store in separate columns if DB allows
            // For now, we append the machine-readable details to the description for context
            const finalDescription = `${formData.description}\n\n[Details: ${formData.brand} ${formData.category}, ${formData.condition}, Bought in ${formData.purchaseYear}]`;

            const { error: dbError } = await supabase
                .from('listings')
                .insert([
                    {
                        user_id: finalUserId, 
                        name: formData.name,
                        description: finalDescription,
                        price: parseFloat(formData.price),
                        location: formData.location,
                        listing_type: formData.listing_type,
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

                        {/* --- ALGORITHM INPUTS (Integrated into your Grid Layout) --- */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select name="category" className="form-select" onChange={handleChange} value={formData.category} disabled={loading}>
                                    <option value="Camera Body">Camera Body</option>
                                    <option value="Lens">Lens</option>
                                    <option value="Drone">Drone</option>
                                    <option value="Lighting">Lighting</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Stabilizer">Stabilizer / Gimbal</option>
                                    <option value="Accessory">Accessory</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Brand</label>
                                <select name="brand" className="form-select" onChange={handleChange} value={formData.brand} disabled={loading}>
                                    <option value="Sony">Sony</option>
                                    <option value="Canon">Canon</option>
                                    <option value="Nikon">Nikon</option>
                                    <option value="Fujifilm">Fujifilm</option>
                                    <option value="Leica">Leica</option>
                                    <option value="DJI">DJI</option>
                                    <option value="GoPro">GoPro</option>
                                    <option value="Profoto">Profoto</option>
                                    <option value="Godox">Godox</option>
                                    <option value="Rode">Rode</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Purchase Year</label>
                                <input name="purchaseYear" type="number" className="form-input" placeholder="e.g. 2023" onChange={handleChange} disabled={loading} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Condition</label>
                                <select name="condition" className="form-select" onChange={handleChange} value={formData.condition} disabled={loading}>
                                    <option value="New (Open Box)">New (Open Box)</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="For Parts">For Parts</option>
                                </select>
                            </div>
                        </div>

                        {/* Listing Type & Price */}
                        <div className="form-group">
                            <label className="form-label">Listing Type</label>
                            <div className="type-toggle">
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
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <label className="form-label">Price ($)</label>
                                {/* --- ALGORITHM RESULT DISPLAY --- */}
                                {predictedPrice && (
                                    <span className="smart-price-hint">
                                        ✨ Market Value: ${predictedPrice}
                                    </span>
                                )}
                            </div>
                            
                            <div className="price-row">
                                <input name="price" type="number" className="form-input" placeholder="0.00" onChange={handleChange} required disabled={loading} />
                                {formData.listing_type === 'For Rent' && (
                                    <select name="rent_period" className="price-period-select" onChange={handleChange} value={formData.rent_period} disabled={loading}>
                                        <option value="daily">/ Day</option>
                                        <option value="weekly">/ Week</option>
                                        <option value="hourly">/ Hour</option>
                                        <option value="monthly">/ Month</option>
                                    </select>
                                )}
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
                            <textarea name="description" rows="4" className="form-textarea" placeholder="Add more details about condition, accessories included, etc." onChange={handleChange} disabled={loading}></textarea>
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