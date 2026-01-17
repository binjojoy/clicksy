// src/utils/knnPricePredictor.js
import { generateMarketData } from './marketDataGenerator';

// 1. Initialize the Knowledge Base (Lazy Learning)
const MARKET_DATA = generateMarketData(); 

// Helper to convert condition string to numeric score
const getConditionScore = (condition) => {
    const scores = { 'New (Open Box)': 6, 'Like New': 5, 'Excellent': 4, 'Good': 3, 'Fair': 2, 'For Parts': 1 };
    return scores[condition] || 3;
};

export const predictPriceKNN = (inputData) => {
    const K = 5; // Look at 5 similar sold items

    // 1. FILTERING (Dimensionality Reduction)
    // Only look at items that match the Brand and Category.
    // If user selects "Sony" and "Camera", we ignore "Rode" and "Mics".
    let relevantData = MARKET_DATA.filter(item => 
        item.brand === inputData.brand && 
        item.category === inputData.category
    );

    // If no exact brand match found (e.g. niche brand), fallback to just Category
    if (relevantData.length === 0) {
        relevantData = MARKET_DATA.filter(item => item.category === inputData.category);
    }
    
    // Safety check
    if (relevantData.length === 0) return null;

    const inputYear = parseInt(inputData.purchaseYear);
    const inputCondScore = getConditionScore(inputData.condition);

    // 2. CALCULATE EUCLIDEAN DISTANCE
    const neighbors = relevantData.map(item => {
        // Distance in Year
        const distYear = Math.abs(item.year - inputYear);
        
        // Distance in Condition
        const distCond = Math.abs(getConditionScore(item.condition) - inputCondScore);

        // Weighted Euclidean Distance
        // We weight Condition x2 because it affects price more than 1 year difference
        const distance = Math.sqrt( (distYear ** 2) + ((distCond * 2) ** 2) );

        return { ...item, distance };
    });

    // 3. SORT & PICK TOP K
    neighbors.sort((a, b) => a.distance - b.distance);
    const nearestNeighbors = neighbors.slice(0, K);

    // 4. WEIGHTED AVERAGE REGRESSION
    let totalWeight = 0;
    let weightedSum = 0;

    nearestNeighbors.forEach(n => {
        // Inverse distance weighting: Closer items have higher influence
        // Add 0.1 to avoid division by zero if exact match
        const weight = 1 / (n.distance + 0.1); 
        weightedSum += n.price * weight;
        totalWeight += weight;
    });

    const predictedPrice = weightedSum / totalWeight;

    // Return rounded to nearest 50
    return Math.ceil(predictedPrice / 50) * 50;
};