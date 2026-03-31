// src/utils/testHash.js  
// Run this once in your browser console or as a temp component

import { calculateImageHash, hammingDistance } from './imageHasher';

export const testDHash = async (file1, file2) => {
    const hash1 = await calculateImageHash(file1);
    const hash2 = await calculateImageHash(file2);
    const distance = hammingDistance(hash1, hash2);

    console.log('Hash 1:', hash1);
    console.log('Hash 2:', hash2);
    console.log('Hamming Distance:', distance);
    console.log('Verdict:', distance <= 10 ? '🚫 BLOCKED (too similar)' : '✅ ALLOWED (different image)');
};