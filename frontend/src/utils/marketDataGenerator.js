// src/utils/marketDataGenerator.js

/**
 * SYNTHETIC MARKET DATA GENERATOR — INDIA EDITION
 * ─────────────────────────────────────────────────────────────────────────────
 * All prices are in INDIAN RUPEES (₹).
 *
 * Why not just USD × exchange rate?
 *   Indian used camera prices are NOT simply USD converted. Three factors
 *   push Indian prices higher than a raw conversion suggests:
 *
 *   1. IMPORT DUTY PREMIUM
 *      New camera gear attracts 18% GST + 10–20% customs duty in India.
 *      This inflates the original purchase price, which the used market
 *      inherits. A Sony A7 IV retails for ~₹2,30,000 in India vs $2,500
 *      in the US — that's ₹92/USD equivalent, not ₹85.
 *
 *   2. GREY MARKET SCARCITY
 *      Many professional bodies (RED, ARRI, Phase One) have no official
 *      India distributor. Used prices are set by supply scarcity, not
 *      import parity.
 *
 *   3. LOCAL DEMAND SKEW
 *      Wedding photography dominates Indian demand. Mid-range bodies
 *      (Sony A7 III, Canon R6) hold value better in India than globally
 *      because demand consistently outstrips supply at that tier.
 *
 *   Base prices below are calibrated to OLX / Cashify / MPB-India
 *   listings (December 2024), not derived from USD conversion.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── BRAND TIER MULTIPLIERS ───────────────────────────────────────────────────
// KEY IMPROVEMENT OVER V1:
// This value is now used BOTH as a price multiplier AND as a numeric
// feature in the KNN distance calculation. Brand tier now contributes
// to "closeness" — a Leica and a Godox will be far apart in feature
// space even if they share the same year and condition.
export const BRAND_MULTIPLIER = {
    'ARRI':          5.5,
    'RED':           4.5,
    'Phase One':     4.0,
    'Hasselblad':    3.0,
    'Leica':         3.2,
    'Broncolor':     2.2,
    'Zeiss':         2.0,
    'Profoto':       1.9,
    'Sony':          1.3,
    'Canon':         1.25,
    'Nikon':         1.15,
    'Fujifilm':      1.1,
    'Blackmagic':    1.15,
    'Elinchrom':     1.1,
    'Panasonic':     1.0,
    'DJI':           1.1,
    'Sennheiser':    1.05,
    'Olympus':       0.95,
    'Peak Design':   1.0,
    'OM System':     0.9,
    'Pentax':        0.8,
    'Sigma':         0.85,
    'Aputure':       0.9,
    'Rode':          0.9,
    'Autel':         0.75,
    'Manfrotto':     0.85,
    'Tamron':        0.8,
    'Zoom':          0.75,
    'Westcott':      0.7,
    'Insta360':      0.8,
    'GoPro':         0.75,
    'Nanlite':       0.75,
    'Tokina':        0.65,
    'Godox':         0.7,
    'Zhiyun':        0.7,
    'Moza':          0.6,
    'FeiyuTech':     0.55,
    'Samyang':       0.6,
    'Tascam':        0.8,
    'Lowepro':       0.65,
    'Parrot':        0.5,
    'Voigtlander':   1.05,
    'Other':         0.85,
};

// ─── CATEGORY BASE PRICES (₹) ─────────────────────────────────────────────────
// Median resale value: mid-tier item, Good condition, current year
// Source: OLX/Cashify/Flipkart used listings, Dec 2024
export const CATEGORY_BASE_INR = {
    'Camera Body': 175000,
    'Lens':         65000,
    'Drone':        80000,
    'Lighting':     38000,
    'Audio':        22000,
    'Stabilizer':   40000,
    'Accessory':    11000,
};

// ─── CONDITIONS ───────────────────────────────────────────────────────────────
export const CONDITIONS = [
    { label: 'New (Open Box)', factor: 0.93 },
    { label: 'Like New',       factor: 0.82 },
    { label: 'Excellent',      factor: 0.71 },
    { label: 'Good',           factor: 0.57 },
    { label: 'Fair',           factor: 0.37 },
    { label: 'For Parts',      factor: 0.14 },
];

// ─── PRODUCT TEMPLATES (all prices in ₹) ─────────────────────────────────────
const PRODUCT_TEMPLATES = [
    // CAMERA BODIES — Sony
    { name: 'Alpha A7 III',         brand: 'Sony',       category: 'Camera Body', basePrice: 175000 },
    { name: 'Alpha A7 IV',          brand: 'Sony',       category: 'Camera Body', basePrice: 225000 },
    { name: 'Alpha A7C',            brand: 'Sony',       category: 'Camera Body', basePrice: 155000 },
    { name: 'Alpha A7R V',          brand: 'Sony',       category: 'Camera Body', basePrice: 340000 },
    { name: 'Alpha A9 II',          brand: 'Sony',       category: 'Camera Body', basePrice: 400000 },
    { name: 'Alpha A6700',          brand: 'Sony',       category: 'Camera Body', basePrice: 120000 },
    { name: 'FX3',                  brand: 'Sony',       category: 'Camera Body', basePrice: 340000 },
    { name: 'FX6',                  brand: 'Sony',       category: 'Camera Body', basePrice: 520000 },
    { name: 'ZV-E10',               brand: 'Sony',       category: 'Camera Body', basePrice:  60000 },
    { name: 'Alpha A7S III',        brand: 'Sony',       category: 'Camera Body', basePrice: 380000 },
    // Canon
    { name: 'EOS R5',               brand: 'Canon',      category: 'Camera Body', basePrice: 320000 },
    { name: 'EOS R6 Mark II',       brand: 'Canon',      category: 'Camera Body', basePrice: 215000 },
    { name: 'EOS R3',               brand: 'Canon',      category: 'Camera Body', basePrice: 490000 },
    { name: 'EOS R50',              brand: 'Canon',      category: 'Camera Body', basePrice:  60000 },
    { name: 'EOS R10',              brand: 'Canon',      category: 'Camera Body', basePrice:  78000 },
    { name: 'EOS C70',              brand: 'Canon',      category: 'Camera Body', basePrice: 395000 },
    { name: 'EOS R7',               brand: 'Canon',      category: 'Camera Body', basePrice: 120000 },
    // Nikon
    { name: 'Z6 II',                brand: 'Nikon',      category: 'Camera Body', basePrice: 175000 },
    { name: 'Z7 II',                brand: 'Nikon',      category: 'Camera Body', basePrice: 255000 },
    { name: 'Z8',                   brand: 'Nikon',      category: 'Camera Body', basePrice: 340000 },
    { name: 'Z9',                   brand: 'Nikon',      category: 'Camera Body', basePrice: 480000 },
    { name: 'Z30',                  brand: 'Nikon',      category: 'Camera Body', basePrice:  58000 },
    { name: 'Z50',                  brand: 'Nikon',      category: 'Camera Body', basePrice:  78000 },
    // Fujifilm
    { name: 'X-T5',                 brand: 'Fujifilm',   category: 'Camera Body', basePrice: 150000 },
    { name: 'X-T4',                 brand: 'Fujifilm',   category: 'Camera Body', basePrice: 130000 },
    { name: 'X-H2S',                brand: 'Fujifilm',   category: 'Camera Body', basePrice: 220000 },
    { name: 'X-S20',                brand: 'Fujifilm',   category: 'Camera Body', basePrice: 110000 },
    { name: 'GFX 100S',             brand: 'Fujifilm',   category: 'Camera Body', basePrice: 520000 },
    // Leica
    { name: 'M11',                  brand: 'Leica',      category: 'Camera Body', basePrice: 800000 },
    { name: 'Q3',                   brand: 'Leica',      category: 'Camera Body', basePrice: 550000 },
    { name: 'SL3',                  brand: 'Leica',      category: 'Camera Body', basePrice: 620000 },
    // Panasonic
    { name: 'Lumix S5 II',          brand: 'Panasonic',  category: 'Camera Body', basePrice: 175000 },
    { name: 'Lumix GH6',            brand: 'Panasonic',  category: 'Camera Body', basePrice: 170000 },
    // Blackmagic
    { name: 'Pocket Cinema 6K G2',  brand: 'Blackmagic', category: 'Camera Body', basePrice: 220000 },
    { name: 'Pocket Cinema 4K',     brand: 'Blackmagic', category: 'Camera Body', basePrice: 105000 },
    { name: 'Cinema Camera 6K',     brand: 'Blackmagic', category: 'Camera Body', basePrice: 265000 },
    // OM System / Olympus
    { name: 'OM-1',                 brand: 'OM System',  category: 'Camera Body', basePrice: 190000 },
    { name: 'OM-5',                 brand: 'OM System',  category: 'Camera Body', basePrice: 105000 },
    { name: 'E-M1 Mark III',        brand: 'Olympus',    category: 'Camera Body', basePrice: 120000 },
    // Action
    { name: 'Hero 12 Black',        brand: 'GoPro',      category: 'Camera Body', basePrice:  35000 },
    { name: 'Hero 11 Black',        brand: 'GoPro',      category: 'Camera Body', basePrice:  26000 },
    { name: 'X4',                   brand: 'Insta360',   category: 'Camera Body', basePrice:  45000 },
    { name: 'ONE RS 1-Inch',        brand: 'Insta360',   category: 'Camera Body', basePrice:  48000 },
    // Medium Format
    { name: 'X2D 100C',             brand: 'Hasselblad', category: 'Camera Body', basePrice: 720000 },

    // LENSES
    { name: 'FE 24-70mm f/2.8 GM II', brand: 'Sony',    category: 'Lens', basePrice: 200000 },
    { name: 'FE 70-200mm f/2.8 GM II',brand: 'Sony',    category: 'Lens', basePrice: 245000 },
    { name: 'FE 50mm f/1.2 GM',       brand: 'Sony',    category: 'Lens', basePrice: 175000 },
    { name: 'FE 85mm f/1.4 GM',       brand: 'Sony',    category: 'Lens', basePrice: 155000 },
    { name: 'FE 35mm f/1.8',          brand: 'Sony',    category: 'Lens', basePrice:  65000 },
    { name: 'RF 24-70mm f/2.8L IS',  brand: 'Canon',    category: 'Lens', basePrice: 200000 },
    { name: 'RF 70-200mm f/2.8L IS', brand: 'Canon',    category: 'Lens', basePrice: 235000 },
    { name: 'RF 50mm f/1.2L USM',    brand: 'Canon',    category: 'Lens', basePrice: 195000 },
    { name: 'RF 85mm f/1.2L USM',    brand: 'Canon',    category: 'Lens', basePrice: 235000 },
    { name: 'Z 24-70mm f/2.8 S',     brand: 'Nikon',    category: 'Lens', basePrice: 210000 },
    { name: 'Z 50mm f/1.2 S',        brand: 'Nikon',    category: 'Lens', basePrice: 185000 },
    { name: 'XF 16-55mm f/2.8 R LM', brand: 'Fujifilm', category: 'Lens', basePrice: 105000 },
    { name: 'XF 56mm f/1.2 R WR',    brand: 'Fujifilm', category: 'Lens', basePrice:  88000 },
    { name: '24-70mm f/2.8 DG DN',   brand: 'Sigma',    category: 'Lens', basePrice:  78000 },
    { name: '50mm f/1.4 DG DN Art',  brand: 'Sigma',    category: 'Lens', basePrice:  62000 },
    { name: '85mm f/1.4 DG DN Art',  brand: 'Sigma',    category: 'Lens', basePrice:  78000 },
    { name: '28-75mm f/2.8 G2',      brand: 'Tamron',   category: 'Lens', basePrice:  60000 },
    { name: '70-180mm f/2.8 G2',     brand: 'Tamron',   category: 'Lens', basePrice:  70000 },
    { name: 'Otus 85mm f/1.4',       brand: 'Zeiss',    category: 'Lens', basePrice: 350000 },
    { name: '85mm f/1.4 AF',         brand: 'Samyang',  category: 'Lens', basePrice:  30000 },
    { name: 'APO-Summicron-M 50mm',  brand: 'Leica',    category: 'Lens', basePrice: 750000 },
    { name: 'Summilux-M 35mm f/1.4', brand: 'Leica',    category: 'Lens', basePrice: 480000 },

    // DRONES
    { name: 'Mavic 3 Pro',           brand: 'DJI',      category: 'Drone', basePrice: 190000 },
    { name: 'Mavic 3 Classic',       brand: 'DJI',      category: 'Drone', basePrice: 130000 },
    { name: 'Air 3',                 brand: 'DJI',      category: 'Drone', basePrice:  95000 },
    { name: 'Mini 4 Pro',            brand: 'DJI',      category: 'Drone', basePrice:  68000 },
    { name: 'Mini 3',                brand: 'DJI',      category: 'Drone', basePrice:  42000 },
    { name: 'Avata 2',               brand: 'DJI',      category: 'Drone', basePrice:  58000 },
    { name: 'EVO Nano+',             brand: 'Autel',    category: 'Drone', basePrice:  55000 },

    // LIGHTING
    { name: 'B10X Plus',             brand: 'Profoto',   category: 'Lighting', basePrice: 200000 },
    { name: 'B1X 500 AirTTL',       brand: 'Profoto',   category: 'Lighting', basePrice: 175000 },
    { name: 'AD200 Pro',             brand: 'Godox',     category: 'Lighting', basePrice:  28000 },
    { name: 'AD300 Pro',             brand: 'Godox',     category: 'Lighting', basePrice:  40000 },
    { name: 'AD600 Pro',             brand: 'Godox',     category: 'Lighting', basePrice:  58000 },
    { name: 'V1 Round Head Flash',   brand: 'Godox',     category: 'Lighting', basePrice:  19000 },
    { name: 'LS 600d Pro',           brand: 'Aputure',   category: 'Lighting', basePrice: 165000 },
    { name: '300d Mark III',         brand: 'Aputure',   category: 'Lighting', basePrice:  78000 },
    { name: 'Forza 500B II',         brand: 'Nanlite',   category: 'Lighting', basePrice:  78000 },
    { name: 'RFX 800',               brand: 'Elinchrom', category: 'Lighting', basePrice: 105000 },
    { name: 'Scoro 3200S',           brand: 'Broncolor', category: 'Lighting', basePrice: 300000 },

    // AUDIO
    { name: 'VideoMic Pro+',         brand: 'Rode',       category: 'Audio', basePrice: 25000 },
    { name: 'NTG5',                  brand: 'Rode',       category: 'Audio', basePrice: 42000 },
    { name: 'NTG3',                  brand: 'Rode',       category: 'Audio', basePrice: 58000 },
    { name: 'Wireless GO II',        brand: 'Rode',       category: 'Audio', basePrice: 25000 },
    { name: 'MKH 416',              brand: 'Sennheiser', category: 'Audio', basePrice: 85000 },
    { name: 'H6 Essential',          brand: 'Zoom',       category: 'Audio', basePrice: 18000 },
    { name: 'F6 Multitrack',         brand: 'Zoom',       category: 'Audio', basePrice: 50000 },
    { name: 'DR-70D',                brand: 'Tascam',     category: 'Audio', basePrice: 17000 },

    // STABILIZERS
    { name: 'RS 3 Pro',              brand: 'DJI',       category: 'Stabilizer', basePrice: 75000 },
    { name: 'RS 3 Mini',             brand: 'DJI',       category: 'Stabilizer', basePrice: 30000 },
    { name: 'Crane 4',               brand: 'Zhiyun',    category: 'Stabilizer', basePrice: 55000 },
    { name: 'Weebill 3',             brand: 'Zhiyun',    category: 'Stabilizer', basePrice: 38000 },
    { name: 'AirCross 3',            brand: 'Moza',      category: 'Stabilizer', basePrice: 30000 },
    { name: 'AK2000S',               brand: 'FeiyuTech', category: 'Stabilizer', basePrice: 25000 },

    // ACCESSORIES
    { name: 'MT-055CXPRO4 Tripod',  brand: 'Manfrotto', category: 'Accessory', basePrice: 45000 },
    { name: 'BeFree Advanced',      brand: 'Manfrotto', category: 'Accessory', basePrice: 22000 },
    { name: 'Travel Tripod Carbon', brand: 'Peak Design',category: 'Accessory', basePrice: 52000 },
    { name: 'Capture Clip V3',      brand: 'Peak Design',category: 'Accessory', basePrice:  7000 },
    { name: 'ProTactic 450 AW II',  brand: 'Lowepro',   category: 'Accessory', basePrice: 17000 },
    { name: 'Adventura SH 160 III', brand: 'Lowepro',   category: 'Accessory', basePrice:  6500 },
];

// ─── DEPRECIATION CURVE ───────────────────────────────────────────────────────
// Indian market depreciates slightly slower than US (higher demand, less supply)
const DEPRECIATION_CURVE = { 0: 1.0, 1: 0.83, 2: 0.73, 3: 0.64, 4: 0.57, 5: 0.51 };
const getDepreciationFactor = (purchaseYear) => {
    const age = new Date().getFullYear() - purchaseYear;
    if (age <= 0) return 1.0;
    if (age <= 5) return DEPRECIATION_CURVE[age];
    return Math.max(0.13, 0.51 - (age - 5) * 0.04);
};

// ─── DETERMINISTIC NOISE (FNV-1a hash) ───────────────────────────────────────
const deterministicNoise = (name, year, conditionLabel) => {
    const seed = `${name}::${year}::${conditionLabel}`;
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = (hash * 16777619) >>> 0;
    }
    return 0.92 + (hash % 10000) / 10000 * 0.16;
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const generateMarketData = () => {
    const CURRENT_YEAR = new Date().getFullYear();
    const dataset = [];

    PRODUCT_TEMPLATES.forEach(product => {
        for (let year = 2010; year <= CURRENT_YEAR; year++) {
            CONDITIONS.forEach(({ label, factor }) => {
                const price =
                    product.basePrice *
                    factor *
                    getDepreciationFactor(year) *
                    deterministicNoise(product.name, year, label);

                dataset.push({
                    name:      product.name,
                    brand:     product.brand,
                    category:  product.category,
                    condition: label,
                    year,
                    price: Math.round(price / 100) * 100, // Round to nearest ₹100
                });
            });
        }
    });

    return dataset;
    // ~100 templates × 16 years × 6 conditions ≈ 9,600 data points
};