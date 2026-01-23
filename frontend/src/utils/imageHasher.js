// frontend/src/utils/imageHasher.js

/**
 * Calculates a SHA-256 hash of the image file.
 * This acts as a unique digital fingerprint.
 */
export async function calculateImageHash(file) {
    // 1. Read the file as an ArrayBuffer (binary data)
    const buffer = await file.arrayBuffer();
    
    // 2. Use the browser's native Crypto API to create a hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    
    // 3. Convert buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}