// utils/imageEmbedder.js

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export const getImageEmbedding = async (file) => {
    const base64 = await fileToBase64(file);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase env variables not found in .env');
    }

    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get-image-embedding`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ imageBase64: base64 })
        }
    );

    const data = await response.json();

    if (data.error) {
        throw new Error('Embedding error: ' + data.error);
    }

    return data.embedding; // 512 floats
};