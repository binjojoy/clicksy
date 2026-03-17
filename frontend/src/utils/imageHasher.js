// utils/imageHasher.js

/**
 * Computes a Difference Hash (dHash) of an image.
 * Robust against resizing, compression, minor color edits.
 * Returns a 16-char hex string (64 bits).
 */
export const calculateImageHash = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            // 9x8 grid → 8 comparisons per row → 64 bits total
            canvas.width = 9;
            canvas.height = 8;
            ctx.drawImage(img, 0, 0, 9, 8);

            const data = ctx.getImageData(0, 0, 9, 8).data;
            let bits = '';

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const i = (y * 9 + x) * 4;
                    const j = (y * 9 + x + 1) * 4;

                    // Convert both pixels to grayscale
                    const gray1 = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                    const gray2 = 0.299 * data[j] + 0.587 * data[j+1] + 0.114 * data[j+2];

                    bits += gray1 < gray2 ? '1' : '0';
                }
            }

            // Convert 64-bit binary → 16-char hex
            let hex = '';
            for (let i = 0; i < 64; i += 4) {
                hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
            }

            URL.revokeObjectURL(img.src);
            resolve(hex);
        };

        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error('Failed to load image for hashing'));
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Hamming distance between two hex hashes.
 * 0 = identical, 64 = completely different.
 * Threshold of 10 is a safe similarity cutoff.
 */
export const hammingDistance = (hex1, hex2) => {
    if (!hex1 || !hex2 || hex1.length !== hex2.length) return 64;
    
    let distance = 0;
    for (let i = 0; i < hex1.length; i++) {
        const b1 = parseInt(hex1[i], 16).toString(2).padStart(4, '0');
        const b2 = parseInt(hex2[i], 16).toString(2).padStart(4, '0');
        for (let j = 0; j < 4; j++) {
            if (b1[j] !== b2[j]) distance++;
        }
    }
    return distance;
};