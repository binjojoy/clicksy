import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '../services/supabaseClient';
import { calculateImageHash } from '../utils/imageHasher'; // <--- NEW IMPORT
import '../styles/UploadPortfolio.css';

const UploadPortfolio = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Nature',
        description: ''
    });

    // 1. CHECK LOCAL STORAGE LOGIN
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

            // --- COPYRIGHT PROTECTION START ---
            // 1. Calculate the unique fingerprint of the image
            const fingerprint = await calculateImageHash(file);
            console.log("Checking copyright for hash:", fingerprint);

            // 2. Check if this exact image exists in the database
            const { data: existingImages, error: checkError } = await supabase
                .from('portfolio_items')
                .select('id, user_id')
                .eq('image_hash', fingerprint);

            if (checkError) throw checkError;

            // 3. If it exists, block the upload
            if (existingImages && existingImages.length > 0) {
                const ownerId = existingImages[0].user_id;
                
                // Optional: Check if the user is re-uploading their OWN image
                if (ownerId === userId) {
                    alert("You have already uploaded this photo.");
                } else {
                    // COPYRIGHT STRIKE
                    alert("COPYRIGHT ALERT: This image belongs to another photographer on this platform. Upload rejected.");
                }
                setLoading(false);
                return; // <--- STOP EVERYTHING
            }
            // --- COPYRIGHT PROTECTION END ---


            // 4. UPLOAD IMAGE (Standard Supabase Upload)
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 5. GET PUBLIC URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            // 6. INSERT INTO DB (Includes the new image_hash)
            const { error: dbError } = await supabase
                .from('portfolio_items')
                .insert([
                    {
                        user_id: userId,
                        title: formData.title,
                        description: formData.description,
                        category: formData.category,
                        media_url: publicUrl,
                        media_type: 'image',
                        image_hash: fingerprint // <--- STORING THE FINGERPRINT
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
        <div className="upload-page">
            <Navbar />
            <div className="upload-container">
                 <div className="upload-card">
                    <div className="upload-header">
                        <h1 className="upload-title">Upload New Work</h1>
                        <p className="upload-subtitle">Showcase your photography to the world</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Project Title</label>
                            <input name="title" type="text" className="form-input" placeholder="e.g. Sunset" onChange={handleChange} disabled={loading} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select" onChange={handleChange} value={formData.category}>
                                <option value="Nature">Nature</option>
                                <option value="Portrait">Portrait</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Street">Street</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Upload Image</label>
                            <div className="file-drop-area">
                                <input type="file" accept="image/*" className="file-input-hidden" onChange={handleFileChange} />
                                <p style={{ color: '#a1a1aa', textAlign: 'center', marginTop: '10px' }}>
                                    {file ? `Selected: ${file.name}` : "Click to upload image"}
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" rows="4" className="form-textarea" placeholder="Description..." onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="btn-upload" disabled={loading}>
                            {loading ? 'Processing...' : 'Publish to Portfolio'}
                        </button>
                    </form>
                 </div>
            </div>
        </div>
    );
};

export default UploadPortfolio;