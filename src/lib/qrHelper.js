import jsQR from 'jsqr';
import { parseNmamitIdentity } from './nmamitId.js';

/**
 * Decodes a QR code from an image File or Blob using HTML5 Canvas and jsQR.
 * @param {File|Blob} file 
 * @returns {Promise<string>} Raw QR string payload
 */
export async function decodeQrFromImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected.'));
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (PNG, JPG, or WebP).'));
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_SIZE_BYTES) {
      return reject(new Error('File exceeds the 5 MB size limit. Please upload a smaller image.'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          // Scale down if extremely large for faster decoding
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data && code.data.trim().length > 0) {
            resolve(code.data.trim());
          } else {
            reject(
              new Error('No readable QR code found in this image. Please ensure the QR code is clearly visible and well-lit.')
            );
          }
        } catch (err) {
          reject(new Error('Failed to process image data: ' + err.message));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image. The file may be corrupt.'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the selected file.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Parses and normalizes member data from various QR payload formats:
 * 1. JSON: {"name":"...","usn":"...","email":"...","branch":"...","year":"..."}
 * 2. Delimited String: "IEEE-NMAMIT:USN:NAME:BRANCH:YEAR" or "IEEE:USN"
 * 3. USN/Email Plaintext: "NN25CSE021" or "you@nmamit.in"
 * 4. Verification URL: "https://.../?usn=NN25CSE021&name=..."
 *
 * @param {string} rawData
 * @returns {Object} Normalized member identity
 */
export function parseMemberQrPayload(rawData) {
  if (!rawData || typeof rawData !== 'string') {
    throw new Error('Invalid QR payload data.');
  }

  const trimmed = rawData.trim();

  // 1. Try parsing JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const usn = (parsed.usn || parsed.USN || '').toUpperCase().trim();
      const email = (parsed.email || parsed.collegeEmail || '').trim().toLowerCase();
      const name = (parsed.name || parsed.displayName || '').trim();
      const branch = (parsed.branch || parsed.department || '').trim();
      const year = (parsed.year || parsed.gradYear || '').toString().trim();
      const uid = (parsed.uid || parsed.id || '').trim();

      return {
        usn,
        name,
        email,
        branch,
        year,
        uid,
        role: parsed.role || 'member',
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        raw: trimmed,
      };
    } catch {
      // Fall through to other parsers
    }
  }

  // 2. Try parsing URL format (e.g., https://ieeenmamit.com/profile?usn=NN25CSE021)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const usn = (url.searchParams.get('usn') || '').toUpperCase().trim();
      const name = (url.searchParams.get('name') || '').trim();
      const email = (url.searchParams.get('email') || '').trim().toLowerCase();
      const branch = (url.searchParams.get('branch') || '').trim();
      const year = (url.searchParams.get('year') || '').trim();

      if (usn || email || name) {
        return {
          usn,
          name,
          email,
          branch,
          year,
          role: 'member',
          raw: trimmed,
        };
      }
    } catch {
      // Fall through
    }
  }

  // 3. Try parsing IEEE NMAMIT Colon-Delimited format (IEEE-NMAMIT:USN:NAME:BRANCH:YEAR)
  if (trimmed.toUpperCase().includes('IEEE')) {
    const parts = trimmed.split(':').map((p) => p.trim());
    // Format: [PREFIX, USN, NAME, BRANCH, YEAR]
    if (parts.length >= 2) {
      const usnCandidate = parts.find((p) => /NN\d{2}[A-Z]{2,6}\d{3}/i.test(p) || /NNM\d{2}[A-Z]{2,6}\d{3}/i.test(p)) || parts[1];
      const nameCandidate = parts.length > 2 ? parts[2] : '';
      const branchCandidate = parts.length > 3 ? parts[3] : '';
      const yearCandidate = parts.length > 4 ? parts[4] : '';

      return {
        usn: usnCandidate.toUpperCase(),
        name: nameCandidate,
        email: usnCandidate ? `${usnCandidate.toLowerCase()}@nmamit.in` : '',
        branch: branchCandidate,
        year: yearCandidate,
        role: 'member',
        raw: trimmed,
      };
    }
  }

  // 4. Try parsing raw USN
  const usnMatch = trimmed.match(/(NN(M)?\d{2}[A-Za-z]{2,6}\d{3})/i);
  if (usnMatch) {
    const usn = usnMatch[1].toUpperCase();
    const identity = parseNmamitIdentity(`${usn} Member`);
    return {
      usn,
      name: identity?.name || 'IEEE Member',
      email: `${usn.toLowerCase()}@nmamit.in`,
      branch: identity?.branchName || identity?.branchCode || '',
      year: identity?.yearLabel || '',
      role: 'member',
      raw: trimmed,
    };
  }

  // 5. Try parsing college email
  if (trimmed.includes('@nmamit.in')) {
    const email = trimmed.toLowerCase();
    const usnPart = email.split('@')[0].toUpperCase();
    return {
      usn: usnPart,
      name: 'IEEE Member',
      email,
      branch: '',
      year: '',
      role: 'member',
      raw: trimmed,
    };
  }

  // 6. Generic payload fallback
  return {
    usn: '',
    name: trimmed.length < 50 ? trimmed : 'IEEE Member',
    email: '',
    branch: '',
    year: '',
    role: 'member',
    raw: trimmed,
  };
}
