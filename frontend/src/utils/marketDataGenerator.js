// src/utils/marketDataGenerator.js

/**
 * SYNTHETIC MARKET DATA GENERATOR
 * Generates thousands of data points to simulate a large real-world database.
 */

const BRANDS = ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Leica', 'Panasonic', 'Blackmagic', 'DJI', 'GoPro', 'Profoto', 'Godox', 'Aputure', 'Rode', 'Sennheiser', 'Manfrotto', 'Zhiyun'];

// Base definitions for item types
const PRODUCT_TEMPLATES = [
    // --- CAMERAS ---
    { name: 'Alpha A7 III', brand: 'Sony', category: 'Camera Body', basePrice: 2000 },
    { name: 'Alpha A7 IV', brand: 'Sony', category: 'Camera Body', basePrice: 2500 },
    { name: 'EOS R5', brand: 'Canon', category: 'Camera Body', basePrice: 3800 },
    { name: 'EOS R6', brand: 'Canon', category: 'Camera Body', basePrice: 2500 },
    { name: 'Z6 II', brand: 'Nikon', category: 'Camera Body', basePrice: 2000 },
    { name: 'X-T5', brand: 'Fujifilm', category: 'Camera Body', basePrice: 1700 },
    { name: 'M11', brand: 'Leica', category: 'Camera Body', basePrice: 8995 },
    { name: 'Pocket Cinema 6K', brand: 'Blackmagic', category: 'Camera Body', basePrice: 2500 },

    // --- DRONES ---
    { name: 'Mavic 3', brand: 'DJI', category: 'Drone', basePrice: 2100 },
    { name: 'Mini 4 Pro', brand: 'DJI', category: 'Drone', basePrice: 759 },
    { name: 'Air 2S', brand: 'DJI', category: 'Drone', basePrice: 1000 },

    // --- LIGHTING (Pro Lights) ---
    { name: 'B10X Plus', brand: 'Profoto', category: 'Lighting', basePrice: 2295 },
    { name: 'AD200 Pro', brand: 'Godox', category: 'Lighting', basePrice: 349 },
    { name: 'LS 600d', brand: 'Aputure', category: 'Lighting', basePrice: 1890 },

    // --- AUDIO (Shotguns) ---
    { name: 'VideoMic Pro+', brand: 'Rode', category: 'Audio', basePrice: 299 },
    { name: 'NTG3', brand: 'Rode', category: 'Audio', basePrice: 699 },
    { name: 'MKH 416', brand: 'Sennheiser', category: 'Audio', basePrice: 999 },

    // --- GIMBALS ---
    { name: 'Crane 4', brand: 'Zhiyun', category: 'Stabilizer', basePrice: 649 },
    { name: 'RS 3 Pro', brand: 'DJI', category: 'Stabilizer', basePrice: 869 },
];

const CONDITIONS = [
    { label: 'New (Open Box)', factor: 0.95 },
    { label: 'Like New', factor: 0.85 },
    { label: 'Excellent', factor: 0.75 },
    { label: 'Good', factor: 0.60 },
    { label: 'Fair', factor: 0.45 },
    { label: 'For Parts', factor: 0.20 }
];

const YEARS = [2020, 2021, 2022, 2023, 2024];

// Generate the dataset
export const generateMarketData = () => {
    let dataset = [];

    PRODUCT_TEMPLATES.forEach(product => {
        YEARS.forEach(year => {
            CONDITIONS.forEach(cond => {
                // Calculate realistic depreciation based on year
                const currentYear = new Date().getFullYear();
                const age = currentYear - year;
                const annualDepreciation = 0.10; // 10% drop per year
                
                let timeFactor = Math.pow((1 - annualDepreciation), age);
                let finalPrice = product.basePrice * cond.factor * timeFactor;

                // Add some "noise" so prices aren't perfect math (makes it look real)
                // Random variation between -5% and +5%
                const noise = 1 + (Math.random() * 0.1 - 0.05); 
                finalPrice = Math.round(finalPrice * noise);

                dataset.push({
                    name: product.name,
                    brand: product.brand,
                    category: product.category,
                    condition: cond.label,
                    year: year,
                    price: finalPrice
                });
            });
        });
    });

    return dataset;
};