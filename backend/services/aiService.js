// backend/services/aiService.js
const { pipeline } = require('@xenova/transformers');

// We use a singleton pattern to load the model only once (faster)
let extractor = null;

const getImageEmbedding = async (imageInput) => {
    try {
        if (!extractor) {
            console.log("⏳ Loading AI Vision Model... (First time only)");
            // 'Xenova/clip-vit-base-patch32' is industry standard for image-to-vector
            extractor = await pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32');
        }

        // Generate the vector (embedding)
        // We handle both URLs and raw file paths
        const output = await extractor(imageInput);
        
        // Convert Float32Array to standard JavaScript Array for Supabase
        return Array.from(output.data);

    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to generate image fingerprint.");
    }
};

module.exports = { getImageEmbedding };