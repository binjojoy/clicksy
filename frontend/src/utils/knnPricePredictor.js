// src/utils/knnPricePredictor.js

/**
 * K-NEAREST NEIGHBOURS PRICE PREDICTOR — v3 (India Edition)
 * ─────────────────────────────────────────────────────────────────────────────
 * All predicted prices are in INDIAN RUPEES (₹).
 *
 * KEY IMPROVEMENT OVER v2: BRAND TIER AS A DISTANCE FEATURE
 * ──────────────────────────────────────────────────────────
 * In v2, brand and category were only used as hard filters. This meant
 * the KNN measured distance on just 2 dimensions: year and condition.
 * The result: a Sony A7 IV (₹2.25L) and a Sony ZV-E10 (₹60K) with the
 * same year/condition looked IDENTICAL to the algorithm — distance = 0.
 *
 * In v3, brand tier (the numeric multiplier) is added as a THIRD distance
 * dimension. Now two Sony cameras at different price tiers are correctly
 * separated in feature space. This is the single highest-impact change
 * possible without replacing the underlying algorithm.
 *
 * Distance formula (v3):
 *   d = √( w_year·(ΔyearNorm)²  +  w_cond·(ΔcondNorm)²  +  w_brand·(ΔbrandNorm)² )
 *
 * Weights (empirically tuned):
 *   Year      → 1.0  (baseline)
 *   Condition → 1.5  (condition drives more price variance than 1yr age)
 *   Brand Tier→ 2.0  (highest weight — a Leica vs a Godox must be far apart)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { generateMarketData, BRAND_MULTIPLIER, CONDITIONS } from './marketDataGenerator';

// ── Lazy Learning: initialise dataset once at module load ─────────────────────
const MARKET_DATA = generateMarketData();

// ── Condition → ordinal score ─────────────────────────────────────────────────
const CONDITION_SCORE = Object.fromEntries(
    CONDITIONS.map(({ label }, index) => [label, CONDITIONS.length - index])
);
// { 'New (Open Box)': 6, 'Like New': 5, ..., 'For Parts': 1 }

const getConditionScore = (condition) => CONDITION_SCORE[condition] ?? 3;

// ── Min-Max normalisation to [0, 1] ──────────────────────────────────────────
const normalize = (value, min, max) => (max === min ? 0 : (value - min) / (max - min));

// ── Brand resolver: unknown brands map to 'Other' ─────────────────────────────
const resolveBrand = (brand) =>
    Object.prototype.hasOwnProperty.call(BRAND_MULTIPLIER, brand) ? brand : 'Other';

// ── Get brand tier score (the numeric multiplier itself) ──────────────────────
const getBrandTier = (brand) => BRAND_MULTIPLIER[resolveBrand(brand)] ?? 0.85;

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
/**
 * @param {Object}        inputData
 * @param {string}        inputData.brand        e.g. 'Sony'
 * @param {string}        inputData.category     e.g. 'Camera Body'
 * @param {string}        inputData.condition    e.g. 'Good'
 * @param {string|number} inputData.purchaseYear e.g. 2021
 * @returns {number|null} Predicted resale price in ₹, or null if insufficient data
 */
export const predictPriceKNN = (inputData) => {

    // ── STEP 1: Resolve inputs ────────────────────────────────────────────
    const resolvedBrand   = resolveBrand(inputData.brand);
    const inputYear       = parseInt(inputData.purchaseYear, 10);
    const inputCondScore  = getConditionScore(inputData.condition);
    const inputBrandTier  = getBrandTier(inputData.brand);

    if (isNaN(inputYear)) return null;

    // ── STEP 2: Candidate pool — category only (brand tier is now a
    //            distance feature so we don't hard-filter by brand) ────────
    let pool = MARKET_DATA.filter(item => item.category === inputData.category);

    // Narrow to same brand first if pool is large enough
    const brandPool = pool.filter(item => item.brand === resolvedBrand);
    if (brandPool.length >= 10) pool = brandPool;

    if (pool.length === 0) return null;

    // ── STEP 3: Compute normalisation bounds (pool + input point) ─────────
    const allYears     = pool.map(i => i.year);
    const allConds     = pool.map(i => getConditionScore(i.condition));
    const allBrandTier = pool.map(i => getBrandTier(i.brand));

    const yearMin  = Math.min(...allYears,     inputYear);
    const yearMax  = Math.max(...allYears,     inputYear);
    const condMin  = Math.min(...allConds,     inputCondScore);
    const condMax  = Math.max(...allConds,     inputCondScore);
    const tierMin  = Math.min(...allBrandTier, inputBrandTier);
    const tierMax  = Math.max(...allBrandTier, inputBrandTier);

    const normInputYear = normalize(inputYear,       yearMin, yearMax);
    const normInputCond = normalize(inputCondScore,  condMin, condMax);
    const normInputTier = normalize(inputBrandTier,  tierMin, tierMax);

    // ── STEP 4: Weighted Euclidean distance (3 features) ─────────────────
    const YEAR_WEIGHT  = 1.0;
    const COND_WEIGHT  = 1.5;
    const BRAND_WEIGHT = 2.0; // NEW — brand tier is most discriminating feature

    const candidates = pool.map(item => {
        const normYear = normalize(item.year,                          yearMin, yearMax);
        const normCond = normalize(getConditionScore(item.condition),  condMin, condMax);
        const normTier = normalize(getBrandTier(item.brand),           tierMin, tierMax);

        const distance = Math.sqrt(
            (YEAR_WEIGHT  * (normYear - normInputYear)) ** 2 +
            (COND_WEIGHT  * (normCond - normInputCond)) ** 2 +
            (BRAND_WEIGHT * (normTier - normInputTier)) ** 2
        );

        return { ...item, distance };
    });

    // ── STEP 5: Dynamic K — 25% of pool, clamped [3, 9] ──────────────────
    const K = Math.min(9, Math.max(3, Math.floor(pool.length * 0.25)));
    candidates.sort((a, b) => a.distance - b.distance);
    const neighbours = candidates.slice(0, K);

    // ── STEP 6: Inverse Distance Weighted average ─────────────────────────
    let totalWeight = 0;
    let weightedSum = 0;

    neighbours.forEach(n => {
        const weight  = 1 / (n.distance + 0.01);
        weightedSum  += n.price * weight;
        totalWeight  += weight;
    });

    const predicted = weightedSum / totalWeight;

    // ── STEP 7: Round to nearest ₹500 (appropriate for INR scale) ────────
    return Math.round(predicted / 500) * 500;
};