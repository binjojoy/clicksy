const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase'); // Your existing supabase config
const { getImageEmbedding } = require('../services/aiService');

// 1. Configure Multer (Store file in memory temporarily)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// --- ROUTE: UPLOAD PORTFOLIO ITEM (WITH AI PROTECTION) ---
// POST /api/v1/portfolio/upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { userId, title, description, category } = req.body;
        const file = req.file;

        if (!file || !userId) {
            return res.status(400).json({ error: "Missing image or user ID" });
        }

        console.log(`📸 Processing Upload for User: ${userId}`);

        // A. Upload Image to Supabase Storage
        // Generate a unique filename: user_id/timestamp_filename.jpg
        const fileName = `${userId}/${Date.now()}_${file.originalname}`;
        
        const { data: storageData, error: storageError } = await supabase
            .storage
            .from('portfolio-images') // Make sure this bucket exists in Supabase
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (storageError) throw new Error(`Storage Upload Failed: ${storageError.message}`);

        // Get the Public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('portfolio-images')
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // B. [MAJOR HIGHLIGHT] Generate AI Copyright Vector
        // We pass the public URL to our AI service
        console.log("🧠 Generating AI Copyright Fingerprint...");
        const embeddingVector = await getImageEmbedding(publicUrl);

        // C. Save Metadata + Vector to Database
        const { data: dbData, error: dbError } = await supabase
            .from('portfolio_items')
            .insert({
                user_id: userId,
                title: title,
                description: description || "",
                category: category || "General",
                media_url: publicUrl,
                media_type: 'image',
                embedding: embeddingVector // <--- Storing the AI Fingerprint
            })
            .select()
            .single();

        if (dbError) throw new Error(`Database Insert Failed: ${dbError.message}`);

        // D. Success Response
        res.status(201).json({
            success: true,
            message: "Portfolio item uploaded and copyright protected.",
            item: dbData
        });

    } catch (err) {
        console.error('Upload Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;