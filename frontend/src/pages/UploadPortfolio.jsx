import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../config/supabaseClient';
import './UploadPortfolio.css';

const UploadPortfolio = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Nature',
        description: ''
    });

    // 1. CHECK LOCAL STORAGE LOGIN (The "Fake" Gate)
    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            alert("You must be logged in to upload.");
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. GET REAL USER ID FROM LOCAL STORAGE
        const userId = localStorage.getItem('user_id');

        if (!userId) {
            alert("User ID not found. Please log in again.");
            navigate('/login');
            return;
        }
        
        if (!file || !formData.title) {
            alert("Please select an image and enter a title.");
            return;
        }

        try {
            setLoading(true);

            // 2. UPLOAD IMAGE (Standard Supabase Upload)
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. GET PUBLIC URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            // 4. INSERT INTO DB (Using the REAL userId)
            const { error: dbError } = await supabase
                .from('portfolio_items')
                .insert([
                    {
                        user_id: userId, // <--- NOW USES THE ID FROM LOCAL STORAGE
                        title: formData.title,
                        description: formData.description,
                        category: formData.category,
                        media_url: publicUrl,
                        media_type: 'image'
                    }
                ]);

            if (dbError) throw dbError;

            alert("Portfolio uploaded successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.error('Error:', error);
            alert("Upload failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // ... (Keep your existing JSX return statement exactly the same) ...
        // Just ensuring you have the JSX from the previous prompt here
        <div className="upload-page">
            <Navbar />
            <div className="upload-container">
                 {/* ... existing form code ... */}
                 {/* Ensure the form calls onSubmit={handleSubmit} */}
                 <div className="upload-card">
                    <div className="upload-header">
                        <h1 className="upload-title">Upload New Work</h1>
                        <p className="upload-subtitle">Showcase your photography to the world</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Title Input */}
                        <div className="form-group">
                            <label className="form-label">Project Title</label>
                            <input name="title" type="text" className="form-input" placeholder="e.g. Sunset" onChange={handleChange} disabled={loading} />
                        </div>

                        {/* Category Dropdown */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" onChange={handleChange} value={formData.category}>
                                <option value="Nature">Nature</option>
                                <option value="Portrait">Portrait</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Street">Street</option>
                            </select>
                        </div>

                        {/* File Input */}
                        <div className="form-group">
                            <label className="form-label">Upload Image</label>
                            <div className="file-drop-area">
                                <input type="file" accept="image/*" className="file-input-hidden" onChange={handleFileChange} />
                                <p style={{ color: '#a1a1aa', textAlign: 'center', marginTop: '10px' }}>
                                    {file ? `Selected: ${file.name}` : "Click to upload image"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" rows="4" className="form-textarea" placeholder="Description..." onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="btn-upload" disabled={loading}>
                            {loading ? 'Uploading...' : 'Publish to Portfolio'}
                        </button>
                    </form>
                 </div>
            </div>
        </div>
    );
};

export default UploadPortfolio;