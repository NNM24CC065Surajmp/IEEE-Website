// ─── NMAMIT USN / Branch utilities ─────────────────────────────────
// Edit BRANCH_CODES as more short-forms get confirmed — nothing else
// in this file needs to change when you add/rename a code.
export const BRANCH_CODES = {
  CS: 'Computer Science and Engineering',
  CSE: 'Computer Science and Engineering',
  IS: 'Information Science and Engineering',
  ISE: 'Information Science and Engineering',
  BTY: 'Biotechnology Engineering',
  BT: 'Biotechnology Engineering',
  EE: 'Electrical and Electronics Engineering',
  EEE: 'Electrical and Electronics Engineering',
  EC: 'Electronics and Communication Engineering',
  ECE: 'Electronics and Communication Engineering',
  AC: 'Advanced Communication Technology',
  ACT: 'Advanced Communication Technology',
  CV: 'Civil Engineering',
  CIVIL: 'Civil Engineering',
  ME: 'Mechanical Engineering',
  MECH: 'Mechanical Engineering',
  VLSI: 'VLSI Design and Technology',  
  CC: 'Computer and Communication Engineering',
  CCE: 'Computer and Communication Engineering',
  CY: 'Cyber Security',
  CYBER: 'Cyber Security',
  AIML: 'Artificial Intelligence and Machine Learning',
  AI: 'Artificial Intelligence and Machine Learning',
  AIDS: 'Artificial Intelligence and Data Science',
  AD: 'Artificial Intelligence and Data Science',
  RI: 'Robotics and Artificial Intelligence',
  RAI: 'Robotics and Artificial Intelligence',
};

// USN formats:
//   2025 batch onward : NN25CSE021   →  NN + YY + branch + 3-digit roll
//   earlier batches   : NNM22CS045   →  NN + M + YY + branch + 3-digit roll
//   VTU batches       : 4NM22CS001   →  4NM + YY + branch + 3-digit roll
// Google Workspace display names at NMAMIT are formatted as "<USN> <FULL NAME>",
// e.g. "NN25CSE021 JOHN DOE" or "NNM22CS045 JANE ROE".
const IDENTITY_REGEX = /^((?:NN(M)?|4NM)(\d{2})([A-Za-z]{2,6})(\d{3}))[\s.\-]+(.+)$/i;
const USN_ONLY_REGEX = /^(?:NN(M)?|4NM)(\d{2})([A-Za-z]{2,6})(\d{3})$/i;

/**
 * Parses a standalone USN string into its components.
 * Supports:
 * - NN25CSE021
 * - NNM22CS045
 * - 4NM22CS001
 * 
 * @param {string} usnRaw 
 * @returns {Object|null}
 */
export function parseNmamitUsn(usnRaw) {
  if (!usnRaw || typeof usnRaw !== 'string') return null;
  const clean = usnRaw.trim().toUpperCase();
  const match = clean.match(USN_ONLY_REGEX);
  if (!match) return null;

  const [, , yy, branchCodeRaw, roll] = match;
  const branchCode = branchCodeRaw.toUpperCase();
  const branchName = BRANCH_CODES[branchCode] || branchCode;
  const batchYear = 2000 + parseInt(yy, 10);
  const gradYear = (batchYear + 4).toString();

  return {
    usn: clean,
    branchCode,
    branchName,
    batchYear,
    roll,
    yearLabel: computeYearLabel(batchYear),
    gradYear,
  };
}

/**
 * Parses a Google account display name into { usn, name, branchCode,
 * branchName, batchYear, roll, yearLabel, gradYear }. Returns null if the display
 * name doesn't match the expected "<USN> <FULL NAME>" pattern — callers
 * should fall back gracefully (e.g. let the person fill the fields in
 * manually from Edit Profile) rather than blocking sign-in on a miss.
 */
export function parseNmamitIdentity(displayName) {
  if (!displayName) return null;
  const trimmed = displayName.trim();
  const match = trimmed.match(IDENTITY_REGEX);
  if (!match) {
    // If only USN is passed without name
    const singleUsn = parseNmamitUsn(trimmed);
    if (singleUsn) {
      return {
        ...singleUsn,
        name: 'IEEE Member',
      };
    }
    return null;
  }

  const [, usnRaw, , yy, branchCodeRaw, roll, namePart] = match;
  const branchCode = branchCodeRaw.toUpperCase();
  const branchName = BRANCH_CODES[branchCode] || branchCode;
  const batchYear = 2000 + parseInt(yy, 10);
  const gradYear = (batchYear + 4).toString();

  return {
    usn: usnRaw.toUpperCase(),
    name: toTitleCase(namePart.trim()),
    branchCode,
    branchName,
    batchYear,
    roll,
    yearLabel: computeYearLabel(batchYear),
    gradYear,
  };
}

/**
 * Rough current year-of-study from the admission (batch) year, assuming
 * a 4-year programme starting around August. Returns 'Alumni' once past
 * year 4, or 'Batch of <year>' if the batch year is somehow in the future.
 */
export function computeYearLabel(batchYear) {
  const now = new Date();
  const academicYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  const yearOfStudy = academicYear - batchYear + 1;
  if (yearOfStudy < 1) return `Batch of ${batchYear}`;
  if (yearOfStudy > 4) return 'Alumni';
  return ['1st Year', '2nd Year', '3rd Year', '4th Year'][yearOfStudy - 1];
}

export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
