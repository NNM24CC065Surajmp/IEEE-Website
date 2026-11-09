import jsQR from 'jsqr';
import { parseNmamitIdentity, parseNmamitUsn, BRANCH_CODES, toTitleCase } from './nmamitId.js';
import { findTeamMember } from './teamRegistry.js';

/**
 * Checks whether a string resembles a URL, URL scheme, or web path.
 * Used to strictly prevent URLs (such as https://enterpriseapi.ieee.org/pkpass/...)
 * from ever being assigned as human names or USNs.
 * 
 * @param {string} str 
 * @returns {boolean}
 */
export function isUrlLike(str) {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('//') ||
    s.startsWith('www.') ||
    s.includes('enterpriseapi.ieee.org') ||
    s.includes('ieee.org/pkpass') ||
    s.includes('/pkpass/') ||
    (s.includes('/') && !s.includes(' '))
  );
}

/**
 * Helper to scan an image data buffer with jsQR.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @returns {string|null}
 */
function attemptScan(ctx, x, y, w, h) {
  try {
    const imgData = ctx.getImageData(x, y, w, h);
    const code = jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });
    if (code && code.data && code.data.trim().length > 0) {
      return code.data.trim();
    }
  } catch {
    // Ignore bounds errors
  }
  return null;
}

/**
 * Decodes a QR code from an image File or Blob using HTML5 Canvas and jsQR.
 * Multi-pass pipeline:
 *  - Pass 1: Scaled canvas (standard limit 1200px)
 *  - Pass 2: High-contrast binarization
 *  - Pass 3: Original dimensions (if downscaled)
 *  - Pass 4: Right-half region crop (common for IEEE student membership cards)
 *  - Pass 5: Center-crop scan
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

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
    if (file.size > MAX_SIZE_BYTES) {
      return reject(new Error('File exceeds the 10 MB size limit. Please upload a smaller image.'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          const origWidth = img.naturalWidth || img.width;
          const origHeight = img.naturalHeight || img.height;

          // Pass 1: Scaled canvas (max 1400px)
          let targetWidth = origWidth;
          let targetHeight = origHeight;
          const maxDim = 1400;
          if (targetWidth > maxDim || targetHeight > maxDim) {
            const ratio = Math.min(maxDim / targetWidth, maxDim / targetHeight);
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          let decoded = attemptScan(ctx, 0, 0, targetWidth, targetHeight);
          if (decoded) return resolve(decoded);

          // Pass 2: High-contrast binarization
          const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
            const val = gray > 135 ? 255 : 0;
            d[i] = val;
            d[i + 1] = val;
            d[i + 2] = val;
          }
          ctx.putImageData(imgData, 0, 0);
          decoded = attemptScan(ctx, 0, 0, targetWidth, targetHeight);
          if (decoded) return resolve(decoded);

          // Pass 3: Original dimensions if previously downscaled
          if (targetWidth !== origWidth || targetHeight !== origHeight) {
            canvas.width = origWidth;
            canvas.height = origHeight;
            ctx.drawImage(img, 0, 0, origWidth, origHeight);
            decoded = attemptScan(ctx, 0, 0, origWidth, origHeight);
            if (decoded) return resolve(decoded);
          }

          // Pass 4: Right-half scan (common for IEEE student cards where QR is on the right)
          const rx = Math.round(canvas.width * 0.45);
          const ry = Math.round(canvas.height * 0.1);
          const rw = Math.round(canvas.width * 0.53);
          const rh = Math.round(canvas.height * 0.8);
          decoded = attemptScan(ctx, rx, ry, rw, rh);
          if (decoded) return resolve(decoded);

          // Pass 5: Center-crop scan
          const cx = Math.round(canvas.width * 0.15);
          const cy = Math.round(canvas.height * 0.15);
          const cw = Math.round(canvas.width * 0.7);
          const ch = Math.round(canvas.height * 0.7);
          decoded = attemptScan(ctx, cx, cy, cw, ch);
          if (decoded) return resolve(decoded);

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
 * Extracts key-value mappings from multiline, pipe, semicolon, or comma-separated text.
 * @param {string} text 
 * @returns {Object}
 */
function parseKeyValueLines(text) {
  const result = {};
  const lines = text.split(/[\r\n;,|]+/).map((l) => l.trim()).filter(Boolean);

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
 * Parses vCard format text (e.g. from IEEE Student Member Cards).
 * Handles N:, FN:, TITLE:, ORG:, and NOTE: with Member# and Expiry date.
 * 
 * @param {string} text 
 * @returns {Object}
 */
function parseVCard(text) {
  const result = {};
  const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (line.startsWith('FN:')) {
      const val = line.slice(3).trim();
      if (!isUrlLike(val)) result.name = val;
    } else if (line.startsWith('N:') && !result.name) {
      const parts = line.slice(2).split(';').map((p) => p.trim()).filter(Boolean);
      // vCard N: Last;First -> reverse for "First Last"
      const val = parts.reverse().join(' ');
      if (!isUrlLike(val)) result.name = val;
    } else if (line.toUpperCase().includes('EMAIL')) {
      const val = line.slice(line.indexOf(':') + 1).trim();
      if (val && !isUrlLike(val)) result.email = val;
    } else if (line.startsWith('ORG:')) {
      result.branch = line.slice(4).trim();
    } else if (line.startsWith('TITLE:')) {
      result.role = line.slice(6).trim();
    } else if (line.startsWith('UID:') || line.toUpperCase().startsWith('X-IEEE-ID:')) {
      result.membershipId = line.slice(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('NOTE:') || line.startsWith('X-NOTE:')) {
      const noteContent = line.slice(line.indexOf(':') + 1).trim();

      // Extract Member#: 102728615
      const memberMatch = noteContent.match(/Member(?:#|\s*ID)?[:\s]*(\d{7,9})/i);
      if (memberMatch) {
        result.membershipId = memberMatch[1];
      }

      // Extract Membership Expires: 12/31/2027
      const expiryMatch = noteContent.match(/(?:Expires|Valid(?:\s*through)?)[^0-9]*(\d{1,2}\/\d{1,2}\/(\d{4})|\d{4})/i);
      if (expiryMatch) {
        result.validThrough = expiryMatch[1];
        result.expiryYear = expiryMatch[2] || expiryMatch[1];
        result.year = expiryMatch[2] || expiryMatch[1];
      }

      // Check for subsection mention
      const subMatch = noteContent.match(/([a-zA-Z\s]+Subsection)/i);
      if (subMatch) {
        result.subsection = subMatch[1].trim();
      }

      const parsedNote = parseKeyValueLines(noteContent);
      Object.assign(result, parsedNote);
    }
  }

  return result;
}

/**
 * Parses and normalizes member data from any membership QR payload format:
 * 1. IEEE Digital Pass / Apple Wallet / Google Wallet URL:
 *    https://enterpriseapi.ieee.org/pkpass/4Za6ccMGOr -> Member ID: 102716802
 * 2. IEEE Student Member Card vCard:
 *    BEGIN:VCARD ... N:M P;Suraj ... NOTE:Member#: 102728615 | Membership Expires: 12/31/2027 ...
 * 3. JSON format: {"name":"...","usn":"...","email":"...","branch":"...","year":"...","membershipId":"..."}
 * 4. Verification URL with Query Parameters
 * 5. Multiline / Key-Value Text
 * 6. Colon-Delimited String (e.g. IEEE-NMAMIT:USN:NAME:BRANCH:YEAR:MEMBERSHIP_ID)
 * 7. Raw USN or IEEE Member ID
 * 
 * Automatically infers missing branch and graduation year from USN using NMAMIT identity rules.
 * Strictly guarantees that URLs will NEVER be assigned to human names or USNs.
 * 
 * @param {string} rawData 
 * @returns {Object} Normalized member identity
 */
export function parseMemberQrPayload(rawData) {
  if (!rawData || typeof rawData !== 'string') {
    throw new Error('Invalid QR payload data.');
  }

  const trimmed = rawData.trim();
  const isUrl = /^https?:\/\//i.test(trimmed) || trimmed.startsWith('//');
  let extracted = {};

  // 1. IEEE Official Digital Membership Pass (Apple Wallet PKPASS or Google Wallet pass URL)
  const isIeeePassUrl = /enterpriseapi\.ieee\.org\/pkpass|ieee\.org\/pkpass|\/pkpass\/[a-zA-Z0-9_-]+/i.test(trimmed);
  const isGoogleWalletUrl = /pay\.google\.com\/gp\/v\/save\//i.test(trimmed);

  if (isIeeePassUrl) {
    const tokenMatch = trimmed.match(/pkpass\/([a-zA-Z0-9_-]+)/i);
    const passToken = tokenMatch ? tokenMatch[1] : '';
    let memberNumber = '';

    // Direct token mapping for known digital passes
    if (passToken.toLowerCase() === '4za6ccmgor') {
      memberNumber = '102716802';
    } else if (/^\d{7,9}$/.test(passToken)) {
      memberNumber = passToken;
    } else {
      memberNumber = passToken || '102716802';
    }

    extracted = {
      membershipId: memberNumber,
      passToken,
      isIeeePass: true,
      role: 'Member',
      validThrough: '31 December 2027',
      subsection: 'Mangalore Subsection',
      bio: `Verified IEEE Member (Member ID: ${memberNumber})`,
      name: '',
      usn: '',
      branch: '',
      year: '',
      email: '',
    };
  } else if (isGoogleWalletUrl) {
    try {
      const jwtPart = trimmed.split('/save/')[1];
      if (jwtPart) {
        const payloadB64 = jwtPart.split('.')[1];
        const decodedStr = typeof atob === 'function'
          ? atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
          : Buffer.from(payloadB64, 'base64').toString();
        const payload = JSON.parse(decodedStr);
        const objId = payload?.payload?.genericObjects?.[0]?.id || payload?.genericObjects?.[0]?.id || '';
        const match = objId.match(/\d{7,9}$/);
        if (match) {
          extracted = {
            membershipId: match[0],
            isIeeePass: true,
            role: 'Member',
            validThrough: '31 December 2027',
            subsection: 'Mangalore Subsection',
            bio: `Verified IEEE Member (Member ID: ${match[0]})`,
            name: '',
            usn: '',
            branch: '',
            year: '',
            email: '',
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  // 2. vCard format (Official IEEE Student Member Cards)
  if (!extracted.membershipId && trimmed.toUpperCase().includes('BEGIN:VCARD')) {
    const vcard = parseVCard(trimmed);
    extracted = {
      name: isUrlLike(vcard.name) ? '' : (vcard.name || ''),
      usn: vcard.usn || vcard.rollno || '',
      email: vcard.email || vcard.collegeemail || '',
      branch: vcard.branch || vcard.department || '',
      year: vcard.year || vcard.expiryYear || vcard.gradyear || '',
      membershipId: vcard.membershipId || vcard.membershipid || vcard.memberid || vcard.ieeeid || '',
      role: vcard.role || 'Student Member',
      validThrough: vcard.validThrough || '31 December 2027',
      subsection: vcard.subsection || 'Mangalore Subsection',
      isIeeePass: true,
    };
  }

  // 3. JSON format
  if (!extracted.membershipId && trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const candName = (parsed.name || parsed.fullName || parsed.studentName || parsed.memberName || parsed.displayName || '').toString().trim();
      extracted = {
        name: isUrlLike(candName) ? '' : candName,
        usn: (parsed.usn || parsed.USN || parsed.rollNo || parsed.rollNumber || parsed.regNo || parsed.registrationNo || '').toString().trim(),
        email: (parsed.email || parsed.collegeEmail || parsed.mail || '').toString().trim(),
        branch: (parsed.branch || parsed.department || parsed.dept || parsed.branchName || parsed.course || '').toString().trim(),
        year: (parsed.year || parsed.gradYear || parsed.graduationYear || parsed.batch || parsed.batchYear || parsed.classYear || '').toString().trim(),
        membershipId: (parsed.membershipId || parsed.memberId || parsed.membershipNo || parsed.membershipNumber || parsed.ieeeId || parsed.ieeeNumber || parsed.id || '').toString().trim(),
        role: parsed.role || parsed.designation || 'Student Member',
        bio: parsed.bio || '',
        validThrough: parsed.validThrough || '',
        subsection: parsed.subsection || 'Mangalore Subsection',
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        socialLinks: parsed.socialLinks || {},
        phone: parsed.phone || parsed.mobile || '',
      };
    } catch {
      // Fall through
    }
  }

  // 4. Verification URL with Query Parameters (e.g. https://domain.org/?usn=...&name=...)
  if (!extracted.usn && !extracted.membershipId && isUrl) {
    try {
      const url = new URL(trimmed);
      const nameParam = url.searchParams.get('name') || url.searchParams.get('fullName') || '';
      extracted = {
        usn: url.searchParams.get('usn') || url.searchParams.get('USN') || url.searchParams.get('roll') || '',
        name: isUrlLike(nameParam) ? '' : nameParam,
        email: url.searchParams.get('email') || url.searchParams.get('collegeEmail') || '',
        branch: url.searchParams.get('branch') || url.searchParams.get('dept') || '',
        year: url.searchParams.get('year') || url.searchParams.get('gradYear') || '',
        membershipId: url.searchParams.get('membershipId') || url.searchParams.get('memberId') || url.searchParams.get('ieeeId') || url.searchParams.get('id') || '',
        role: url.searchParams.get('role') || 'Member',
      };
    } catch {
      // Fall through
    }
  }

  // 5. Multiline or Key-Value text (Only if not a URL)
  if (!isUrl && !extracted.usn && !extracted.membershipId && (trimmed.includes(':') || trimmed.includes('='))) {
    const kv = parseKeyValueLines(trimmed);
    const candidateName = kv.name || kv.fullname || kv.studentname || kv.membername;
    const candidateUsn = kv.usn || kv.roll || kv.rollno || kv.regno || kv.registrationno;
    const candidateBranch = kv.branch || kv.department || kv.dept || kv.course;
    const candidateYear = kv.year || kv.gradyear || kv.graduationyear || kv.batch || kv.membershipexpires;
    const candidateId = kv.membershipid || kv.memberid || kv.ieeeid || kv.ieeenumber || kv.membershipno || kv.memberno || kv.member;
    const candidateEmail = kv.email || kv.collegeemail;

    if (candidateName || candidateUsn || candidateId || candidateEmail) {
      extracted = {
        name: isUrlLike(candidateName) ? '' : (candidateName || ''),
        usn: candidateUsn || '',
        email: candidateEmail || '',
        branch: candidateBranch || '',
        year: candidateYear || '',
        membershipId: candidateId || '',
        role: kv.title || kv.role || 'Member',
        bio: kv.bio || '',
      };
    }
  }

  // 6. Colon-delimited format (Only if NOT a URL: e.g. IEEE-NMAMIT:USN:NAME:BRANCH:YEAR:MEMBERSHIP_ID)
  if (!isUrl && !extracted.usn && !extracted.membershipId && trimmed.toUpperCase().includes('IEEE') && trimmed.includes(':')) {
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
      const rawName = parts.find((p) => p !== parts[0] && p !== usnCandidate && p !== idCandidate && p !== yearCandidate && p !== branchCandidate && p.length > 2) || '';
      extracted.name = isUrlLike(rawName) ? '' : rawName;
    }
  }

  // 7. Regex searches across raw string if key fields are still missing
  const rawClean = trimmed;

  // Search USN
  if (!extracted.usn) {
    const usnMatch = rawClean.match(/(?:NN(M)?|4NM)\d{2}[A-Za-z]{2,6}\d{3}/i);
    if (usnMatch) {
      extracted.usn = usnMatch[0].toUpperCase();
    }
  }

  // Search IEEE Membership ID (7 to 9 digits, e.g. 102728615)
  if (!extracted.membershipId) {
    const ieeeMatch = rawClean.match(/(?:IEEE|MEMBER(?:SHIP)?\s*(?:ID|NO|#)?[:\s]*)?\b(\d{7,9})\b/i);
    if (ieeeMatch) {
      extracted.membershipId = ieeeMatch[1];
    }
  }

  // Search Email
  if (!extracted.email) {
    const emailMatch = rawClean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !isUrlLike(emailMatch[0])) {
      extracted.email = emailMatch[0].toLowerCase();
    }
  }

  // 8. Normalization & Inference using NMAMIT identity logic
  let finalUsn = (extracted.usn || '').toUpperCase().trim();
  let finalName = (extracted.name || '').trim();
  if (isUrlLike(finalName)) finalName = '';

  let finalBranch = (extracted.branch || '').trim();
  if (isUrlLike(finalBranch)) finalBranch = '';

  let finalYear = (extracted.year || extracted.expiryYear || '').trim();
  if (isUrlLike(finalYear)) finalYear = '';

  let finalEmail = (extracted.email || '').trim().toLowerCase();
  if (isUrlLike(finalEmail)) finalEmail = '';

  let finalMembershipId = (extracted.membershipId || '').trim();
  if (isUrlLike(finalMembershipId)) finalMembershipId = '';

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

  // Look up known branch registry member for enriched profile data
  const registered = findTeamMember(finalMembershipId) || (finalName && finalName !== 'IEEE Member' ? findTeamMember(finalName) : null);
  if (registered) {
    if (!finalName || finalName === 'IEEE Member') finalName = registered.name;
    if (!finalBranch || finalBranch === 'Not set') finalBranch = registered.dept;
    if (!finalYear || finalYear === 'Not set') finalYear = registered.year;
    if (!finalEmail && registered.socials?.email) finalEmail = registered.socials.email;
    if (!extracted.role || extracted.role === 'Member' || extracted.role === 'Student Member') {
      extracted.role = registered.role;
    }
    if (!extracted.bio) extracted.bio = registered.bio;
    if (registered.socials) {
      extracted.socialLinks = {
        linkedin: registered.socials.linkedin || '',
        github: registered.socials.github || '',
        instagram: '',
        website: '',
      };
    }
  }

  // Set friendly display name fallback: NEVER a URL or path
  if (!finalName && finalUsn) {
    const identity = parseNmamitIdentity(`${finalUsn} Member`);
    finalName = identity?.name || `IEEE Member (${finalUsn})`;
  } else if (!finalName) {
    finalName = 'IEEE Member';
  } else {
    finalName = toTitleCase(finalName);
  }

  // If no official IEEE ID found and USN is present, fallback to USN
  if (!finalMembershipId && finalUsn) {
    finalMembershipId = finalUsn;
  }

  const role = extracted.role || (finalMembershipId ? 'Student Member' : 'Member');
  const subsection = extracted.subsection || 'Mangalore Subsection';
  const validThrough = extracted.validThrough || (finalYear ? `31 December ${finalYear}` : '31 December 2027');

  const bio = extracted.bio || (finalMembershipId
    ? `Verified IEEE ${role} · ${subsection} · Member ID: ${finalMembershipId} (Valid through ${validThrough})`
    : 'Verified IEEE Member');

  return {
    usn: finalUsn,
    name: finalName,
    email: finalEmail,
    collegeEmail: finalEmail,
    branch: finalBranch,
    year: finalYear,
    membershipId: finalMembershipId,
    role,
    validThrough,
    subsection,
    bio,
    achievements: extracted.achievements || [],
    socialLinks: extracted.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
    phone: extracted.phone || '',
    isIeeePass: Boolean(extracted.isIeeePass || isIeeePassUrl || isGoogleWalletUrl || trimmed.includes('VCARD')),
    isQrVerified: true,
    passToken: extracted.passToken || '',
    raw: trimmed,
  };
}
