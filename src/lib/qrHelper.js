import jsQR from 'jsqr';
import { parseNmamitIdentity, parseNmamitUsn, BRANCH_CODES, toTitleCase } from './nmamitId.js';

/**
 * Decodes a QR code from an image File or Blob using HTML5 Canvas and jsQR.
 * Uses a multi-pass approach (normal, contrast-enhanced, and original) for maximum reliability.
 * 
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

          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Pass 1: Scaled canvas (standard limit 1200px)
          let targetWidth = width;
          let targetHeight = height;
          const maxDim = 1200;
          if (targetWidth > maxDim || targetHeight > maxDim) {
            const ratio = Math.min(maxDim / targetWidth, maxDim / targetHeight);
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          let imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data && code.data.trim().length > 0) {
            return resolve(code.data.trim());
          }

          // Pass 2: Contrast & binarization pass
          const d = imageData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
            const val = gray > 128 ? 255 : 0;
            d[i] = val;
            d[i + 1] = val;
            d[i + 2] = val;
          }
          ctx.putImageData(imageData, 0, 0);
          code = jsQR(d, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data && code.data.trim().length > 0) {
            return resolve(code.data.trim());
          }

          // Pass 3: Original dimensions if previously downscaled
          if (targetWidth !== width || targetHeight !== height) {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            imageData = ctx.getImageData(0, 0, width, height);
            code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });
            if (code && code.data && code.data.trim().length > 0) {
              return resolve(code.data.trim());
            }
          }

          reject(
            new Error(
              'No readable QR code found in this image. Please ensure the QR code is clearly visible, well-lit, and in focus.'
            )
          );
        } catch (err) {
          reject(new Error('Failed to process image data: ' + err.message));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image. The file may be corrupt or unreadable.'));
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
 * Extracts key-value mappings from multiline or semicolon/comma-separated text.
 * @param {string} text 
 * @returns {Object}
 */
function parseKeyValueLines(text) {
  const result = {};
  const lines = text.split(/[\r\n;,]+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const delimiterIndex = line.indexOf(':') !== -1 ? line.indexOf(':') : line.indexOf('=');
    if (delimiterIndex > 0) {
      const key = line.slice(0, delimiterIndex).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const value = line.slice(delimiterIndex + 1).trim();
      if (key && value) {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Parses vCard format text.
 * @param {string} text 
 * @returns {Object}
 */
function parseVCard(text) {
  const result = {};
  const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.startsWith('FN:')) {
      result.name = line.slice(3).trim();
    } else if (line.startsWith('N:') && !result.name) {
      const parts = line.slice(2).split(';').map((p) => p.trim()).filter(Boolean);
      result.name = parts.reverse().join(' ');
    } else if (line.toUpperCase().includes('EMAIL')) {
      const val = line.slice(line.indexOf(':') + 1).trim();
      if (val) result.email = val;
    } else if (line.startsWith('ORG:')) {
      result.branch = line.slice(4).trim();
    } else if (line.startsWith('TITLE:')) {
      result.role = line.slice(6).trim();
    } else if (line.startsWith('UID:') || line.toUpperCase().startsWith('X-IEEE-ID:')) {
      result.membershipId = line.slice(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('NOTE:') || line.startsWith('X-NOTE:')) {
      const noteContent = line.slice(line.indexOf(':') + 1).trim();
      const parsedNote = parseKeyValueLines(noteContent);
      Object.assign(result, parsedNote);
    }
  }

  return result;
}

/**
 * Parses and normalizes member data from any membership QR payload format:
 * 1. JSON: {"name":"...","usn":"...","email":"...","branch":"...","year":"...","membershipId":"..."}
 * 2. vCard: BEGIN:VCARD ... END:VCARD
 * 3. Key-Value Text: Name: ..., USN: ..., Branch: ..., Year: ..., Member ID: ...
 * 4. Delimited String: "IEEE-NMAMIT:USN:NAME:BRANCH:YEAR:MEMBERSHIP_ID"
 * 5. Verification URL: "https://.../?usn=...&name=...&membershipId=..."
 * 6. Raw USN string: "NN25CSE021" or "4NM22CS001"
 * 7. Raw IEEE Member ID: "98765432"
 * 
 * Automatically infers missing branch and graduation year from USN using NMAMIT identity rules.
 * 
 * @param {string} rawData 
 * @returns {Object} Normalized member identity
 */
export function parseMemberQrPayload(rawData) {
  if (!rawData || typeof rawData !== 'string') {
    throw new Error('Invalid QR payload data.');
  }

  const trimmed = rawData.trim();
  let extracted = {};

  // 1. JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      extracted = {
        name: parsed.name || parsed.fullName || parsed.studentName || parsed.memberName || parsed.displayName || '',
        usn: (parsed.usn || parsed.USN || parsed.rollNo || parsed.rollNumber || parsed.regNo || parsed.registrationNo || '').toString().trim(),
        email: (parsed.email || parsed.collegeEmail || parsed.mail || '').toString().trim(),
        branch: (parsed.branch || parsed.department || parsed.dept || parsed.branchName || parsed.course || '').toString().trim(),
        year: (parsed.year || parsed.gradYear || parsed.graduationYear || parsed.batch || parsed.batchYear || parsed.classYear || '').toString().trim(),
        membershipId: (parsed.membershipId || parsed.memberId || parsed.membershipNo || parsed.membershipNumber || parsed.ieeeId || parsed.ieeeNumber || parsed.id || '').toString().trim(),
        role: parsed.role || parsed.designation || 'member',
        bio: parsed.bio || '',
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        socialLinks: parsed.socialLinks || {},
        phone: parsed.phone || parsed.mobile || '',
      };
    } catch {
      // Fall through
    }
  }

  // 2. vCard format
  if (!extracted.usn && !extracted.membershipId && trimmed.toUpperCase().includes('BEGIN:VCARD')) {
    const vcard = parseVCard(trimmed);
    extracted = {
      name: vcard.name || vcard.fullname || '',
      usn: vcard.usn || vcard.rollno || '',
      email: vcard.email || vcard.collegeemail || '',
      branch: vcard.branch || vcard.department || '',
      year: vcard.year || vcard.gradyear || '',
      membershipId: vcard.membershipid || vcard.memberid || vcard.ieeeid || '',
      role: vcard.role || 'member',
    };
  }

  // 3. Verification URL format
  if (!extracted.usn && !extracted.membershipId && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
    try {
      const url = new URL(trimmed);
      extracted = {
        usn: url.searchParams.get('usn') || url.searchParams.get('USN') || url.searchParams.get('roll') || '',
        name: url.searchParams.get('name') || url.searchParams.get('fullName') || '',
        email: url.searchParams.get('email') || url.searchParams.get('collegeEmail') || '',
        branch: url.searchParams.get('branch') || url.searchParams.get('dept') || '',
        year: url.searchParams.get('year') || url.searchParams.get('gradYear') || '',
        membershipId: url.searchParams.get('membershipId') || url.searchParams.get('memberId') || url.searchParams.get('ieeeId') || url.searchParams.get('id') || '',
        role: url.searchParams.get('role') || 'member',
      };
    } catch {
      // Fall through
    }
  }

  // 4. Multiline or Key-Value text
  if (!extracted.usn && !extracted.membershipId && (trimmed.includes(':') || trimmed.includes('='))) {
    const kv = parseKeyValueLines(trimmed);
    const candidateName = kv.name || kv.fullname || kv.studentname || kv.membername;
    const candidateUsn = kv.usn || kv.roll || kv.rollno || kv.regno || kv.registrationno;
    const candidateBranch = kv.branch || kv.department || kv.dept || kv.course;
    const candidateYear = kv.year || kv.gradyear || kv.graduationyear || kv.batch;
    const candidateId = kv.membershipid || kv.memberid || kv.ieeeid || kv.ieeenumber || kv.membershipno || kv.memberno;
    const candidateEmail = kv.email || kv.collegeemail;

    if (candidateName || candidateUsn || candidateId || candidateEmail) {
      extracted = {
        name: candidateName || '',
        usn: candidateUsn || '',
        email: candidateEmail || '',
        branch: candidateBranch || '',
        year: candidateYear || '',
        membershipId: candidateId || '',
        bio: kv.bio || '',
      };
    }
  }

  // 5. Colon-delimited format (e.g. IEEE-NMAMIT:USN:NAME:BRANCH:YEAR:MEMBERSHIP_ID)
  if (!extracted.usn && !extracted.membershipId && trimmed.toUpperCase().includes('IEEE') && trimmed.includes(':')) {
    const parts = trimmed.split(':').map((p) => p.trim());
    if (parts.length >= 2) {
      const usnCandidate = parts.find((p) => /^(?:NN(M)?|4NM)\d{2}[A-Za-z]{2,6}\d{3}$/i.test(p));
      const idCandidate = parts.find((p) => /^\d{7,9}$/.test(p));
      const yearCandidate = parts.find((p) => /^(20\d{2}|[1-4](st|nd|rd|th)?\s*Year)$/i.test(p));
      const branchCandidate = parts.find((p) => /^(CSE?|ISE?|ECE?|EEE?|AIML|AIDS|MECH?|CIVIL?|BTY|VLSI|CCE?)$/i.test(p));

      extracted.usn = usnCandidate || '';
      extracted.membershipId = idCandidate || '';
      extracted.year = yearCandidate || '';
      extracted.branch = branchCandidate || '';
      extracted.name = parts.find((p) => p !== parts[0] && p !== usnCandidate && p !== idCandidate && p !== yearCandidate && p !== branchCandidate && p.length > 2) || '';
    }
  }

  // 6. Regex searches across raw string if any key field is still missing
  const rawClean = trimmed;

  // Search USN
  if (!extracted.usn) {
    const usnMatch = rawClean.match(/(?:NN(M)?|4NM)\d{2}[A-Za-z]{2,6}\d{3}/i);
    if (usnMatch) {
      extracted.usn = usnMatch[0].toUpperCase();
    }
  }

  // Search IEEE Membership ID (7 to 9 digits, e.g. 98765432)
  if (!extracted.membershipId) {
    const ieeeMatch = rawClean.match(/(?:IEEE|MEMBER(?:SHIP)?\s*(?:ID|NO|#)?[:\s]*)?\b(\d{7,9})\b/i);
    if (ieeeMatch) {
      extracted.membershipId = ieeeMatch[1];
    }
  }

  // Search Email
  if (!extracted.email) {
    const emailMatch = rawClean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      extracted.email = emailMatch[0].toLowerCase();
    }
  }

  // 7. Normalization & Inference using NMAMIT identity logic
  let finalUsn = (extracted.usn || '').toUpperCase().trim();
  let finalName = (extracted.name || '').trim();
  let finalBranch = (extracted.branch || '').trim();
  let finalYear = (extracted.year || '').trim();
  let finalEmail = (extracted.email || '').trim().toLowerCase();
  let finalMembershipId = (extracted.membershipId || '').trim();

  // If USN is present, infer missing academic fields
  if (finalUsn) {
    const parsedUsn = parseNmamitUsn(finalUsn);
    if (parsedUsn) {
      if (!finalBranch) finalBranch = parsedUsn.branchName;
      if (!finalYear) finalYear = parsedUsn.gradYear || parsedUsn.yearLabel;
    }

    if (!finalEmail) {
      finalEmail = `${finalUsn.toLowerCase()}@nmamit.in`;
    }
  }

  // Expand branch short code if needed
  if (finalBranch && BRANCH_CODES[finalBranch.toUpperCase()]) {
    finalBranch = BRANCH_CODES[finalBranch.toUpperCase()];
  }

  // If display name or name wasn't extracted, check Google identity style string
  if (!finalName && finalUsn) {
    const identity = parseNmamitIdentity(`${finalUsn} Member`);
    finalName = identity?.name || `IEEE Member (${finalUsn})`;
  } else if (!finalName) {
    finalName = finalMembershipId ? `IEEE Member #${finalMembershipId}` : 'IEEE Member';
  } else {
    finalName = toTitleCase(finalName);
  }

  // Ensure an official membership ID exists (use extracted ID, or fallback to USN)
  if (!finalMembershipId && finalUsn) {
    finalMembershipId = finalUsn;
  }

  return {
    usn: finalUsn,
    name: finalName,
    email: finalEmail,
    collegeEmail: finalEmail,
    branch: finalBranch,
    year: finalYear,
    membershipId: finalMembershipId,
    role: extracted.role || 'member',
    bio: extracted.bio || `Verified IEEE Member (${finalMembershipId ? `ID: ${finalMembershipId}` : 'Pass'})`,
    achievements: extracted.achievements || [],
    socialLinks: extracted.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
    phone: extracted.phone || '',
    raw: trimmed,
  };
}
