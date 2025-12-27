import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './UploadPortfolio.css'; // Importing the CSS file above

const UploadPortfolio = () => {
    // State to handle form inputs (Design logic only)
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Nature',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder logic - No backend connection yet
        alert(`Design Test:\nTitle: ${formData.title}\nCategory: ${formData.category}\nFile: ${file ? file.name : "None"}`);
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
                        
                        {/* Title Input */}
                        <div className="form-group">
                            <label className="form-label">Project Title</label>
                            <input 
                                name="title"
                                type="text" 
                                className="form-input"
                                placeholder="e.g. Sunset at the Beach"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                name="category" 
                                className="form-select"
                                onChange={handleChange}
                            >
                                <option value="Nature">Nature</option>
                                <option value="Portrait">Portrait</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Street">Street</option>
                                <option value="Architecture">Architecture</option>
                            </select>
                        </div>

                        {/* Custom File Upload Area */}
                        <div className="form-group">
                            <label className="form-label">Upload Image</label>
                            <div className="file-drop-area">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="file-input-hidden"
                                    onChange={handleFileChange}
                                />
                                
                                {/* SVG Icon */}
                                <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                
                                <p style={{ color: '#a1a1aa' }}>
                                    {file ? `Selected: ${file.name}` : "Click or drag to upload image"}
                                </p>
                                
                                {file && <p className="file-preview-text">Ready to upload!</p>}
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea 
                                name="description"
                                rows="4" 
                                className="form-textarea"
                                placeholder="Tell us the story behind this shot..."
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-upload">
                            Publish to Portfolio
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPortfolio;