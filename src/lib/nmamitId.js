// ─── NMAMIT USN / Branch utilities ─────────────────────────────────
// Edit BRANCH_CODES as more short-forms get confirmed — nothing else
// in this file needs to change when you add/rename a code.
export const BRANCH_CODES = {
  CS: 'Computer Science and Engineering',
  CSE: 'Computer Science and Engineering',
  IS: 'Information Science and Engineering',
  ISE: 'Information Science and Engineering',
  BTY: 'Biotechnology Engineering',
  EE: 'Electrical and Electronics Engineering',
  EEE: 'Electrical and Electronics Engineering',
  EC: 'Electronics and Communication Engineering',
  ECE: 'Electronics and Communication Engineering',
  AC: 'Advanced Communication Technology',   // TODO: confirm official full name
  ACT: 'Advanced Communication Technology',  // TODO: confirm official full name
  CV: 'Civil Engineering',                   // TODO: confirm short code used
  CIVIL: 'Civil Engineering',
  ME: 'Mechanical Engineering',              // TODO: confirm short code used
  MECH: 'Mechanical Engineering',
  VLSI: 'VLSI Design and Technology',        // TODO: confirm short code used
  CCE: 'Computer and Communication Engineering', // TODO: confirm full name
  CY: 'Cyber Security',                      // TODO: confirm short code used
  CYBER: 'Cyber Security',                   // TODO: confirm full name
  AIML: 'Artificial Intelligence and Machine Learning',
  AIDS: 'Artificial Intelligence and Data Science',
};

// USN formats:
//   2025 batch onward : NN25CSE021   →  NN + YY + branch + 3-digit roll
//   earlier batches    : NNM22CS045   →  NN + M + YY + branch + 3-digit roll
// Google Workspace display names at NMAMIT are formatted as "<USN> <FULL NAME>",
// e.g. "NN25CSE021 JOHN DOE" or "NNM22CS045 JANE ROE".
const IDENTITY_REGEX = /^(NN(M)?(\d{2})([A-Za-z]{2,6})(\d{3}))[\s.\-]+(.+)$/i;

/**
 * Parses a Google account display name into { usn, name, branchCode,
 * branchName, batchYear, roll, yearLabel }. Returns null if the display
 * name doesn't match the expected "<USN> <FULL NAME>" pattern — callers
 * should fall back gracefully (e.g. let the person fill the fields in
 * manually from Edit Profile) rather than blocking sign-in on a miss.
 */
export function parseNmamitIdentity(displayName) {
  if (!displayName) return null;
  const match = displayName.trim().match(IDENTITY_REGEX);
  if (!match) return null;

  const [, usnRaw, , yy, branchCodeRaw, roll, namePart] = match;
  const branchCode = branchCodeRaw.toUpperCase();
  const branchName = BRANCH_CODES[branchCode] || branchCode; // unknown code → show the raw code until the map is updated
  const batchYear = 2000 + parseInt(yy, 10);

  return {
    usn: usnRaw.toUpperCase(),
    name: toTitleCase(namePart.trim()),
    branchCode,
    branchName,
    batchYear,
    roll,
    yearLabel: computeYearLabel(batchYear),
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

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}