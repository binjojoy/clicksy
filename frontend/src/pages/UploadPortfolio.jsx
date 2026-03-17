import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { calculateImageHash, hammingDistance } from '../utils/imageHasher';
import { getImageEmbedding } from '../utils/imageEmbedder';
import '../styles/UploadPortfolio.css';

const DHASH_THRESHOLD = 10;       // Hamming distance — lower = stricter
const CLIP_THRESHOLD = 0.90;      // Cosine similarity — higher = stricter

const UploadPortfolio = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Nature',
        description: ''
    });

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

            // ── LAYER 1: dHash — instant, no API ─────────────────────────
            setStatusMessage('Checking for duplicates...');
            const fingerprint = await calculateImageHash(file);

            const { data: existingImages, error: checkError } = await supabase
                .from('portfolio_items')
                .select('id, user_id, image_hash, title');

            if (checkError) throw checkError;

            for (const item of (existingImages || [])) {
                if (!item.image_hash) continue;
                const distance = hammingDistance(fingerprint, item.image_hash);

                if (distance <= DHASH_THRESHOLD) {
                    alert(
                        item.user_id === userId
                            ? `You already uploaded a very similar photo: "${item.title}"`
                            : `COPYRIGHT ALERT: This image is too similar to "${item.title}" already on this platform. Upload rejected.`
                    );
                    return;
                }
            }

            // ── LAYER 2: CLIP via HuggingFace — catches edits/crops ──────
            let embedding = null;
            
            try {
                setStatusMessage('Running AI copyright check (this may take 20s on first run)...');
                embedding = await getImageEmbedding(file);

                const { data: similarImages, error: vecError } = await supabase
                    .rpc('match_images', {
                        query_embedding: embedding,
                        similarity_threshold: CLIP_THRESHOLD,
                        match_count: 1
                    });

                if (vecError) throw vecError;

                if (similarImages && similarImages.length > 0) {
                    const match = similarImages[0];
                    const pct = Math.round(match.similarity * 100);
                    alert(
                        match.user_id === userId
                            ? `You already uploaded a very similar photo: "${match.title}" (${pct}% match)`
                            : `COPYRIGHT ALERT: This image is ${pct}% visually similar to "${match.title}" on this platform. Upload rejected.`
                    );
                    return; // Stop upload if duplicate is found
                }
            } catch (hfError) {
                // If Hugging Face fails, log it and move on. We do NOT throw the error to the outer catch block.
                console.warn("AI similarity check failed, proceeding with hash-only check.", hfError);
                embedding = null; // Ensure embedding is null so it doesn't break the database insert
            }

            // ── BOTH CHECKS PASSED (OR LAYER 2 FAILED GRACEFULLY) ────────
            setStatusMessage('Uploading...');
            const fileExt = file.name.split('.').pop();
            const filePath = `uploads/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            // Prepare database payload
            const insertPayload = {
                user_id: userId,
                title: formData.title,
                description: formData.description,
                category: formData.category,
                media_url: publicUrl,
                media_type: 'image',
                image_hash: fingerprint
            };

            // Only add embedding if Layer 2 succeeded
            if (embedding) {
                insertPayload.embedding = embedding;
            }

            const { error: dbError } = await supabase
                .from('portfolio_items')
                .insert([insertPayload]);

            if (dbError) throw dbError;

            alert("Portfolio uploaded successfully!");
            navigate('/dashboard');

        } catch (error) {
            // This now only catches absolute failures (Layer 1 DB fetch, Uploading to Storage, or Final DB Insert)
            console.error('Upload error:', error);
            alert("Upload failed: " + error.message);
        } finally {
            setLoading(false);
            setStatusMessage('');
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
                            <input name="title" type="text" className="form-input"
                                placeholder="e.g. Sunset" onChange={handleChange} disabled={loading} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select name="category" className="form-select"
                                onChange={handleChange} value={formData.category} disabled={loading}>
                                <option value="Nature">Nature</option>
                                <option value="Portrait">Portrait</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Street">Street</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Upload Image</label>
                            <div className="file-drop-area">
                                <input type="file" accept="image/*"
                                    className="file-input-hidden" onChange={handleFileChange} disabled={loading} />
                                <p style={{ color: '#a1a1aa', textAlign: 'center', marginTop: '10px' }}>
                                    {file ? `Selected: ${file.name}` : "Click to upload image"}
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea name="description" rows="4" className="form-textarea"
                                placeholder="Description..." onChange={handleChange} disabled={loading} />
                        </div>

                        {/* Status message shown during processing */}
                        {statusMessage && (
                            <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '12px' }}>
                                ⏳ {statusMessage}
                            </p>
                        )}

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