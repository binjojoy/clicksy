// src/utils/knnPricePredictor.js

const KNN_API_URL = import.meta.env.VITE_KNN_API_URL;

/**
 * Calls the Clicksy KNN Price Predictor hosted on Hugging Face Spaces.
 * @param {Object} inputData
 * @param {string} inputData.brand
 * @param {string} inputData.category
 * @param {string} inputData.condition
 * @param {string|number} inputData.purchaseYear
 * @returns {Promise<number|null>} Predicted resale price in ₹, or null on error
 */
export const predictPriceKNN = async (inputData) => {
    const { brand, category, condition, purchaseYear } = inputData;

    const year = parseInt(purchaseYear, 10);
    if (!year || year < 2000 || year > 2025) return null;

    try {
        const response = await fetch(`${KNN_API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                brand,
                category,
                condition,
                purchase_year: year,
                sale_year: new Date().getFullYear(),
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.predicted_price_inr ?? null;

    } catch (err) {
        console.warn('[Clicksy] Price predictor unavailable:', err.message);
        return null;
    }
};