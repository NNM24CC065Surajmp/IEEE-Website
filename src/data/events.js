// src/data/events.js
// Built from the posters in 1.pdf. Posters go in public/events/ (served at /events/<file>).
// Dates are ISO strings in IST. A null date means the poster did not show one.
// Lines marked CHECK need a quick confirmation from the branch.

export const events = [
  {
    id: "activity-inauguration-2026-27",
    title: "Activity Inauguration 2026-27",
    category: "Inauguration",
    batch: "2026-27",
    startDate: "2026-10-07T14:30:00+05:30",
    endDate: "2026-10-07T16:30:00+05:30", // CHECK: end time not on poster
    venue: "Shambhavi Hall, APJ 1st Floor, NMAMIT",
    format: "Offline",
    organizer: "IEEE SB NMAMIT",
    description:
      "Inauguration of the IEEE SB NMAMIT activities for 2026-27. New Beginnings, Bigger Dreams: a new chapter begins with ideas, innovation and you. Contact: Ajmal (Chair), Ninaad (Vice Chair).",
    poster: "/events/activity-inauguration-2026-27.webp",
    registrationLink:
      "https://docs.google.com/forms/d/e/1FAIpQLSfhwN4JXkiFEWTYNEe1KmZ5JS7mEvhvs8mvtqDVMoJDOruIzw/viewform",
  },
  {
    id: "online-technical-quiz-2026",
    title: "Online Technical Quiz - IEEE Day",
    category: "Competition",
    batch: "2026-27",
    startDate: "2026-10-04T18:00:00+05:30",
    endDate: "2026-10-04T20:00:00+05:30",
    venue: "Online",
    format: "Online, 2 rounds",
    organizer: "Student Activity Committee, IEEE Mangalore Subsection",
    description:
      "Online technical quiz on account of IEEE Day. Round 1: Basic. Round 2: Intermediate. Open to IEEE members of all branches. Last day to register: 1 October 2026.",
    poster: "/events/online-technical-quiz-2026.webp",
    registrationLink: "https://forms.gle/ob3vtz9tyncsk9Kx5",
    registrationDeadline: "2026-10-01T23:59:00+05:30",
  },
  {
    id: "project-to-paper-2026",
    title: "Project to Paper 2026",
    category: "Competition",
    batch: "2026-27",
    startDate: null,
    endDate: "2026-10-04T23:59:00+05:30", // submission deadline
    venue: "Online submission",
    format: "Individual / team (no limit on authors)",
    organizer: "IEEE SB NMAMIT",
    description:
      "Technical writing competition open to all UG and PG students. Papers must be in IEEE format and based on a project done this academic year; already published papers are accepted. No registration fee, digital certificates for all participants. Submission deadline: 4 October 2026, 11:59 PM. Contact: Prof. Vasudeva, IEEE SB Counselor.",
    poster: "/events/project-to-paper-2026.webp",
    registrationLink: "https://forms.gle/cFkbYwNCwYafy3GCA",
    registrationDeadline: "2026-10-04T23:59:00+05:30",
    registrationLabel: "Submit Paper",
  },
  {
    id: "b-htc-2024",
    title: "IEEE B-HTC 2024 Inauguration",
    category: "Conference",
    batch: "2023-24",
    startDate: "2024-03-21T15:00:00+05:30",
    endDate: "2024-03-21T17:00:00+05:30", // CHECK: end time not on poster
    venue: "Sowparnika Seminar Hall, NMAMIT, Nitte",
    format: "Offline",
    organizer: "IEEE Bangalore Section, IEEE Mangalore Subsection, NMAMIT",
    description:
      "Inauguration of the 2024 IEEE Bangalore Humanitarian Technology Conference. Theme: SDG14 - Life Below Water. Chief Guest: Dr. Chengappa M R (HP Enterprises, Vice Chair Industry Engagement and SIGHT Chair, IEEE Bangalore Section). President: Dr. Niranjan N Chiplunkar, Principal, NMAMIT.",
    poster: "/events/b-htc-2024.webp",
    registrationLink: null,
  },
  {
    id: "ieee-membership-webinar-2024",
    title: "Webinar on Benefits of IEEE Membership",
    category: "Webinar",
    batch: "2024-25",
    startDate: "2024-08-22T19:30:00+05:30",
    endDate: "2024-08-22T20:30:00+05:30", // CHECK: end time not on poster
    venue: "Google Meet",
    format: "Online",
    organizer: "IEEE SB NMAMIT",
    description:
      "Online webinar on the benefits of IEEE membership. Speaker: Suprith Patil, MDC Lead, IEEE Bangalore Section.",
    poster: "/events/ieee-membership-webinar-2024.webp",
    registrationLink: null,
  },
  {
    id: "ieee-day-2024",
    title: "IEEE Day 2024",
    category: "Celebration",
    batch: "2024-25",
    startDate: "2024-10-03T14:00:00+05:30",
    endDate: "2024-10-03T17:00:00+05:30", // CHECK: end time not on poster
    venue: "Karyagar Sabhangan (Mechanical Workshop), NMAMIT",
    format: "Offline",
    organizer: "IEEE SB NMAMIT",
    description:
      "Celebration of IEEE Day's 15th anniversary: 'Let's celebrate innovation, technology, and the spirit of collaboration'. Highlights: a quiz, Ideate (develop limitless ideas), cash prizes and a membership drive. Open to all.",
    poster: "/events/ieee-day-2024.webp",
    registrationLink: null,
  },
  {
    id: "project-to-paper-2024",
    title: "Project to Paper",
    category: "Competition",
    batch: "2024-25",
    startDate: null,
    endDate: "2024-11-23T23:59:00+05:30", // submission deadline
    venue: "Online submission",
    format: "Individual / team (no limit on authors)",
    organizer: "IEEE SB NMAMIT",
    description:
      "Technical writing competition for all UG and PG students. Papers must be in IEEE format and based on a project done this academic year; already published papers are accepted. No registration fee. Total prize money Rs. 12,000 with separate prizes for departments. Digital certificates for all participants. Submission deadline: 23 November 2024.",
    poster: "/events/project-to-paper-2024.webp",
    registrationLink: null,
  },
  {
    id: "mss-agm-2025",
    title: "Annual General Meeting of IEEE Mangalore Subsection",
    category: "Meeting",
    batch: "2024-25",
    startDate: "2025-01-11T14:00:00+05:30",
    endDate: "2025-01-11T16:00:00+05:30",
    venue: "Sambhram Auditorium, NMAMIT, Nitte",
    format: "Offline",
    organizer: "IEEE Mangalore Subsection",
    description:
      "AGM of the IEEE Mangalore Subsection with activity and financial reports, IEEE MSS awards, IEEE SB evaluation results and the 2025 slate announcement, followed by high tea.",
    poster: "/events/mss-agm-2025.webp",
    registrationLink: null,
  },
  {
    id: "aide-2025",
    title: "AIDE 2025 - International Conference on AI and Data Engineering",
    category: "Conference",
    batch: "2024-25",
    startDate: "2025-02-06T09:00:00+05:30", // CHECK: time not on poster
    endDate: "2025-02-07T17:00:00+05:30",
    venue: "NMAMIT, Nitte",
    format: "Offline",
    organizer: "NMAMIT, technically co-sponsored by IEEE Bangalore Section and IEEE Mangalore Subsection",
    description:
      "2025 International Conference on Artificial Intelligence and Data Engineering (AIDE), 6-7 February 2025. The image is the proceedings cover.",
    poster: "/events/aide-2025.webp",
    registrationLink: null,
  },
  {
    id: "tech-triad-2025",
    title: "The Tech Triad",
    category: "Competition",
    batch: "2024-25",
    startDate: "2025-03-22T09:00:00+05:30",
    endDate: "2025-03-22T13:00:00+05:30",
    venue: "SMV Block ADL 01, 03, NMAMIT, Nitte",
    format: "Offline",
    organizer: "IEEE Mangalore Subsection, HackerEarth Hub NMAMIT",
    description:
      "Offline tech competition with a prize pool of Rs. 15,000. Open to all.",
    poster: "/events/tech-triad-2025.webp",
    registrationLink: null,
  },
  {
    id: "spark-hunt-2025",
    title: "Spark Hunt",
    category: "Competition",
    batch: "2024-25",
    startDate: "2025-04-11T13:45:00+05:30", // CHECK: year not on poster (11 April was a Friday in 2025)
    endDate: "2025-04-11T16:00:00+05:30", // CHECK: end time not on poster
    venue: "ADL04, NMAMIT",
    format: "Offline",
    organizer: "IEEE SB NMAMIT, Institution's Innovation Council",
    description:
      "Web Hunt Level 1 and Level 2, held as part of World Creativity and Innovation Day (21 April) celebrations. Prize pool Rs. 5,000. Entry free; exclusive to IEEE members and first-year students.",
    poster: "/events/spark-hunt-2025.webp",
    registrationLink: null,
  },
  {
    id: "primed-aptitude-test-2025",
    title: "PRIMED Round 1: Aptitude Test",
    category: "Competition",
    batch: "2024-25",
    startDate: "2025-05-02T19:30:00+05:30",
    endDate: "2025-05-02T21:00:00+05:30", // CHECK: end time not on poster
    venue: "Online",
    format: "Individual",
    organizer: "IEEE Mangalore Subsection SAC and Industry Relations Committee, HackerEarth Hub NMAMIT",
    description:
      "First round of PRIMED, the placement hackathon. Online aptitude test for 3rd year students of MSS region colleges. Shortlisted participants move to the next round. Registration closed 30 April 2025.",
    poster: "/events/primed-aptitude-test-2025.webp",
    registrationLink: null,
  },
  {
    id: "primed-placement-hackathon-2025",
    title: "PRIMED - The Placement Hackathon",
    category: "Hackathon",
    batch: "2024-25",
    startDate: "2025-05-02T19:30:00+05:30",
    endDate: "2025-05-17T17:00:00+05:30",
    venue: "Online rounds; interviews at AJIET, Mangalore",
    format: "Individual",
    organizer: "IEEE Mangalore Subsection SAC and Industry Relations Committee",
    description:
      "Four rounds: Aptitude (2 May, online), Technical (9 May, online), Technical Interview and HR Interview (17 May, offline at AJIET, Mangalore). For 3rd year students of the Mangalore Subsection region. Entry fee: Rs. 50 for IEEE members, Rs. 100 for non-members. Winners get a chance at an industrial internship.",
    poster: "/events/primed-placement-hackathon-2025.webp",
    registrationLink: null,
  },
  {
    id: "grss-inaugural-2025",
    title: "IEEE GRSS Student Branch Chapter Inauguration and Technical Talk",
    category: "Talk",
    batch: "2025-26",
    startDate: "2025-08-12T10:00:00+05:30",
    endDate: "2025-08-12T12:00:00+05:30", // CHECK: end time not on poster
    venue: "RS & GIS Lab, SMV Block, NMAMIT",
    format: "Offline",
    organizer: "Department of Civil Engineering, IEEE GRSS Student Branch Chapter",
    description:
      "Inaugural function of the IEEE GRSS Student Branch Chapter with a technical talk by Dr. Chandan M C, Assistant Professor, Department of Water Resources and Ocean Engineering, NITK Surathkal.",
    poster: "/events/grss-inaugural-2025.webp",
    registrationLink: null,
  },
  {
    id: "treasure-hunt-2025",
    title: "Treasure Hunt",
    category: "Competition",
    batch: "2025-26", // CHECK: year not on poster; assumed 2025 (GRSS logo, 8 August 2025 was a Friday)
    startDate: "2025-08-08T14:00:00+05:30",
    endDate: "2025-08-08T15:45:00+05:30",
    venue: "ISL02 and ISL03, NMAMIT",
    format: "Offline",
    organizer: "IEEE SB NMAMIT, IEEE GRSS",
    description:
      "Treasure hunt with a prize pool of Rs. 6,000 plus gifts. Free entry for 1st year students and IEEE members; Rs. 100 for non-members.",
    poster: "/events/treasure-hunt-2025.webp",
    registrationLink: null,
  },
];

// ---------------------------------------------------------------------------
// Helpers (the Events page should use these instead of re-implementing logic)
// ---------------------------------------------------------------------------
const toDate = (v) => (v ? new Date(v) : null);

// "live" | "upcoming" | "ended" | "open" (deadline-only events, still accepting entries)
export const getStatus = (event, now = new Date()) => {
  const start = toDate(event.startDate);
  const end = toDate(event.endDate) || start;
  if (!start && !end) return "ended";
  if (!start) return now <= end ? "open" : "ended";
  if (now < start) return "upcoming";
  if (end && now > end) return "ended";
  return "live";
};

// Register / Submit button is shown only when this is true.
export const isRegistrationOpen = (event, now = new Date()) => {
  if (!event.registrationLink) return false;
  if (getStatus(event, now) === "ended") return false;
  const deadline = toDate(event.registrationDeadline);
  return !deadline || now <= deadline;
};

const sortKey = (e) =>
  (toDate(e.startDate) || toDate(e.endDate) || new Date(0)).getTime();

// Newest first
export const sortedEvents = [...events].sort((a, b) => sortKey(b) - sortKey(a));

// Event shown in the hero.
// 1) nearest live/upcoming event, preferring ones whose registration is open
// 2) otherwise a deadline-style "open" event
// 3) otherwise the latest past event (mode "latest", no countdown)
export const getSpotlight = (now = new Date()) => {
  const by = (list) =>
    [...list].sort((a, b) => {
      const ra = isRegistrationOpen(a, now) ? 0 : 1;
      const rb = isRegistrationOpen(b, now) ? 0 : 1;
      return ra - rb || sortKey(a) - sortKey(b);
    })[0];

  const current = events.filter((e) => ["live", "upcoming"].includes(getStatus(e, now)));
  if (current.length) {
    const event = by(current);
    return { event, mode: getStatus(event, now) };
  }
  const open = events.filter((e) => getStatus(e, now) === "open");
  if (open.length) return { event: by(open), mode: "open" };
  const past = sortedEvents.filter((e) => getStatus(e, now) === "ended");
  return { event: past[0] || null, mode: "latest" };
};

// Default content of the permanent right-hand side panel:
// the most recent past event that is not already the hero event.
export const getDefaultPanelEvent = (now = new Date()) => {
  const { event: hero } = getSpotlight(now);
  return (
    sortedEvents.find((e) => getStatus(e, now) === "ended" && e.id !== hero?.id) ||
    sortedEvents[0] ||
    null
  );
};

export const batches = [...new Set(events.map((e) => e.batch).filter(Boolean))].sort().reverse();
export const categories = [...new Set(events.map((e) => e.category))].sort();
