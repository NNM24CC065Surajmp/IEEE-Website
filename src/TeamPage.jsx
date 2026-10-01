import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Award,
  ArrowRight,
  Building2,
  BookOpen,
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

/**
 * ============================================================================
 * IEEE Student Branch NMAMIT - Team Page Component
 * ============================================================================
 */

// ============================================================================
// ROLE-BASED COLOR THEMING (Flat & Simple)
// ============================================================================
const DEPARTMENT_THEMES = {
  leadership: {
    activeBorder: 'border-red-600 dark:border-red-500',
    roleText: 'text-red-600 dark:text-red-400',
  },
  secretariat: {
    activeBorder: 'border-purple-600 dark:border-purple-500',
    roleText: 'text-purple-600 dark:text-purple-400',
  },
  technical: {
    activeBorder: 'border-[#00629B] dark:border-[#5db4e8]',
    roleText: 'text-[#00629B] dark:text-[#5db4e8]',
  },
  finance: {
    activeBorder: 'border-orange-500 dark:border-orange-400',
    roleText: 'text-orange-600 dark:text-orange-400',
  },
  events: {
    activeBorder: 'border-yellow-400 dark:border-yellow-400',
    roleText: 'text-yellow-500 dark:text-yellow-400',
  },
  design: {
    activeBorder: 'border-pink-600 dark:border-pink-500',
    roleText: 'text-pink-600 dark:text-pink-400',
  },
  content: {
    activeBorder: 'border-teal-600 dark:border-teal-500',
    roleText: 'text-teal-600 dark:text-teal-400',
  },
  marketing: {
    activeBorder: 'border-emerald-600 dark:border-emerald-500',
    roleText: 'text-emerald-600 dark:text-emerald-400',
  },
};

const getDepartmentTheme = (role) => {
  const r = (role || '').toLowerCase().trim();
  if (r.includes('president')) return DEPARTMENT_THEMES.leadership;
  if (r.includes('secretary')) return DEPARTMENT_THEMES.secretariat;
  if (r.includes('tech') || r.includes('coding') || r.includes('hardware')) return DEPARTMENT_THEMES.technical;
  if (r.includes('treasur') || r.includes('tressur') || r.includes('finance')) return DEPARTMENT_THEMES.finance;
  if (r.includes('event') || r.includes('logistics')) return DEPARTMENT_THEMES.events;
  if (r.includes('design') || r.includes('creative')) return DEPARTMENT_THEMES.design;
  if (r.includes('content') || r.includes('editorial')) return DEPARTMENT_THEMES.content;
  if (r.includes('market') || r.includes('sponsor') || r.includes('outreach')) return DEPARTMENT_THEMES.marketing;
  return DEPARTMENT_THEMES.technical;
};

const isCoreMember = (role = '') => {
  const r = (role || '').toLowerCase().trim();
  return (
    r.includes('president') ||
    r.includes('secretary') ||
    r.includes('treasur') ||
    r.includes('tressur') ||
    r.includes('office bearer')
  );
};

const DEPARTMENT_ABBREVIATIONS = {
  'information science and engineering': 'ISE',
  'information science & engineering': 'ISE',
  'information science engineering': 'ISE',
  'information science': 'ISE',
  'information science and technology': 'ISE',
  'ise': 'ISE',
  'computer science and engineering': 'CSE',
  'computer science & engineering': 'CSE',
  'computer science engineering': 'CSE',
  'computer science': 'CSE',
  'cse': 'CSE',
  'computer and communication engineering': 'CCE',
  'computer & communication engineering': 'CCE',
  'cce': 'CCE',
  'electronics and communication engineering': 'ECE',
  'electronics & communication engineering': 'ECE',
  'electronics and communication': 'ECE',
  'ece': 'ECE',
  'electrical and electronics engineering': 'EEE',
  'electrical & electronics engineering': 'EEE',
  'eee': 'EEE',
  'mechanical engineering': 'ME',
  'me': 'ME',
  'civil engineering': 'CE',
  'ce': 'CE',
  'artificial intelligence and machine learning': 'AIML',
  'artificial intelligence & machine learning': 'AIML',
  'aiml': 'AIML',
  'artificial intelligence and data science': 'AIDS',
  'artificial intelligence & data science': 'AIDS',
  'aids': 'AIDS',
};

const formatDeptYear = (rawDept = '', rawYear = '') => {
  let dept = (rawDept || '').trim();
  let year = (rawYear || '').trim();

  // If department and year are stored together in one string (e.g. "ISE - 3RD")
  if (!year && dept.includes('-')) {
    const parts = dept.split('-');
    dept = parts[0].trim();
    year = parts.slice(1).join('-').trim();
  }

  // Abbreviate department if in predefined list, otherwise keep unchanged
  const cleanKey = dept.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  const formattedDept = DEPARTMENT_ABBREVIATIONS[cleanKey] || dept;

  // Format year (1 -> 1ST, 2 -> 2ND, 3 -> 3RD, 4 -> 4TH, handles "Third Year", etc.)
  let formattedYear = '';
  if (year) {
    const y = year.toLowerCase();
    if (y.includes('1') || y.includes('first')) formattedYear = '1ST';
    else if (y.includes('2') || y.includes('second')) formattedYear = '2ND';
    else if (y.includes('3') || y.includes('third')) formattedYear = '3RD';
    else if (y.includes('4') || y.includes('fourth') || y.includes('final')) formattedYear = '4TH';
    else formattedYear = year.toUpperCase();
  }

  if (formattedDept && formattedYear) {
    return `${formattedDept} - ${formattedYear}`;
  }
  return formattedDept || formattedYear;
};

const isValidSocial = (val) => {
  if (!val) return false;
  const str = String(val).trim();
  return str !== '' && str !== '-' && str !== '#' && str.toLowerCase() !== 'none';
};

const getSocialUrl = (platform, val) => {
  if (!isValidSocial(val)) return null;
  const str = String(val).trim();
  if (platform === 'email') {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(str)}`;
  }
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return str;
  }
  if (platform === 'github') {
    const match = str.match(/https?:\/\/[^\s]+/);
    if (match) return match[0];
    return `https://github.com/${str.replace(/\s+/g, '')}`;
  }
  if (platform === 'linkedin') {
    if (str.includes(' ')) {
      return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(str)}`;
    }
    return `https://www.linkedin.com/in/${str}`;
  }
  return str;
};

// ============================================================================
// DATA: ~25 Core Team Members (President First)
// ============================================================================
const CORE_TEAM_MEMBERS = [
  {
    id: 'adithya-rao',
    name: 'Adithya Rao',
    role: 'President',
    division: 'Executive Committee',
    dept: 'Computer Science & Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94821',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees branch operations, strategic collaborations with IEEE Bangalore Section, and annual flagship conferences. Passionate about systems architecture and distributed computing.',
    skills: ['Strategic Planning', 'Distributed Systems', 'Team Leadership', 'Community Building'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'president.ieee@nmamit.in',
    },
  },
  {
    id: 'sneha-shenoy',
    name: 'Sneha Shenoy',
    role: 'Vice President',
    division: 'Executive Committee',
    dept: 'Information Science & Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94822',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    bio: 'Directs society integration across CS, RAS, and WIE chapters. Focused on industry sponsorship and student research symposiums.',
    skills: ['Operations', 'Industry Outreach', 'Full Stack', 'Symposium Lead'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'vp.ieee@nmamit.in',
    },
  },
  {
    id: 'rohan-kulkarni',
    name: 'Rohan Kulkarni',
    role: 'Secretary',
    division: 'Executive Committee',
    dept: 'Electronics & Communication',
    year: '3rd Year',
    memberId: 'IEEE STB-94823',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Maintains official branch documentations, Section communications, and compliance with IEEE vTools reporting guidelines.',
    skills: ['Documentation', 'vTools Reporting', 'Embedded C', 'Operations'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'secretary.ieee@nmamit.in',
    },
  },
  {
    id: 'pooja-hegde',
    name: 'Pooja Hegde',
    role: 'Treasurer',
    division: 'Executive Committee',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94824',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    bio: 'Manages financial auditing, annual grant disbursements from IEEE HQ, and workshop budget management for student activities.',
    skills: ['Budgeting', 'Grant Writing', 'Auditing', 'Financial Planning'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'treasurer.ieee@nmamit.in',
    },
  },
  {
    id: 'varun-nayak',
    name: 'Varun Nayak',
    role: 'Joint Secretary',
    division: 'Executive Committee',
    dept: 'Information Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94825',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Assists with intra-college committee alignment, venue logistics, and coordinating member recruitment drives.',
    skills: ['Logistics', 'Member Engagement', 'Event Ops', 'Python'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'jointsec.ieee@nmamit.in',
    },
  },
  {
    id: 'karthik-bhat',
    name: 'Karthik Bhat',
    role: 'Technical Lead',
    division: 'Technology Wing',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94826',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    bio: 'Leads developer bootcamps, algorithmic workshops, and mentors student teams competing in national and global hackathons.',
    skills: ['C++', 'Competitive Programming', 'Algorithms', 'Mentorship'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'tech.ieee@nmamit.in',
    },
  },
  {
    id: 'gautham-prabhu',
    name: 'Gautham Prabhu',
    role: 'Web & Dev Lead',
    division: 'Technology Wing',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94827',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: 'Architects and maintains branch portals, registration infrastructure, and open-source tooling for campus engineering events.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Cloud Architecture'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'web.ieee@nmamit.in',
    },
  },
  {
    id: 'ananya-kamath',
    name: 'Ananya Kamath',
    role: 'Design & Creative Head',
    division: 'Design Wing',
    dept: 'Artificial Intelligence & Data Science',
    year: '3rd Year',
    memberId: 'IEEE STB-94828',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    bio: 'Defines visual branding, UI/UX design systems, poster aesthetics, and event collateral across all digital touchpoints.',
    skills: ['UI/UX Design', 'Figma', 'Brand Systems', 'Creative Direction'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'design.ieee@nmamit.in',
    },
  },
  {
    id: 'siddharth-shetty',
    name: 'Siddharth Shetty',
    role: 'Events & Operations Head',
    division: 'Operations',
    dept: 'Mechanical Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94829',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees on-ground event execution, auditorium configurations, speaker hospitality, and schedule precision.',
    skills: ['Operations', 'Crisis Management', 'Stage Coordination', 'Hospitality'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'events.ieee@nmamit.in',
    },
  },
  {
    id: 'meghana-pai',
    name: 'Meghana Pai',
    role: 'PR & Media Lead',
    division: 'Media & Outreach',
    dept: 'Computer & Communication Eng.',
    year: '3rd Year',
    memberId: 'IEEE STB-94830',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Heads digital storytelling, press releases, social campaigns, and public relations with colleges across Karnataka.',
    skills: ['Media Strategy', 'Public Relations', 'Content Curation', 'Copywriting'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'pr.ieee@nmamit.in',
    },
  },
  {
    id: 'raksha-acharya',
    name: 'Raksha Acharya',
    role: 'WIE (Women in Eng.) Chair',
    division: 'Affinity Groups',
    dept: 'Electronics & Communication',
    year: '3rd Year',
    memberId: 'IEEE STB-94831',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bio: 'Leads Women in Engineering initiatives, hackathons, and mentorship pipelines promoting gender parity in STEM fields.',
    skills: ['WIE Leadership', 'Mentorship', 'Hardware Systems', 'STEM Advocacy'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'wie.ieee@nmamit.in',
    },
  },
  {
    id: 'divya-mallya',
    name: 'Divya Mallya',
    role: 'WIE Vice Chair',
    division: 'Affinity Groups',
    dept: 'Computer Science & Engineering',
    year: '2nd Year',
    memberId: 'IEEE STB-94832',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    bio: 'Coordinates high-school outreach programs, coding bootcamps for women, and panel discussions with women tech leaders.',
    skills: ['Outreach', 'Workshop Coordination', 'Web Dev', 'Public Speaking'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'wie.sub@nmamit.in',
    },
  },
  {
    id: 'nikhil-sharma',
    name: 'Nikhil Sharma',
    role: 'IEEE Computer Society Chair',
    division: 'Technical Chapters',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94833',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    bio: 'Heads NMAMIT IEEE Computer Society chapter, organizing deep-dive sessions in cloud architectures, AI, and systems engineering.',
    skills: ['Cloud Computing', 'Docker / K8s', 'Society Chapter Ops', 'DevOps'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'cs.chair@nmamit.in',
    },
  },
  {
    id: 'pranav-nayak',
    name: 'Pranav Nayak',
    role: 'Robotics & Automation (RAS) Chair',
    division: 'Technical Chapters',
    dept: 'Robotics & Artificial Intelligence',
    year: '3rd Year',
    memberId: 'IEEE STB-94834',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    bio: 'Directs autonomous rover prototyping, ROS2 tutorials, and represents the branch at national robotics symposia.',
    skills: ['ROS2', 'Autonomous Navigation', 'Microcontrollers', 'CAD / Fusion360'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'ras.chair@nmamit.in',
    },
  },
  {
    id: 'shruthi-rao',
    name: 'Shruthi Rao',
    role: 'Editorial & Content Lead',
    division: 'Content Wing',
    dept: 'Information Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94835',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    bio: 'Curates the annual branch newsletter, technical blogs, speaker interview articles, and annual activity reports for IEEE Bangalore Section.',
    skills: ['Technical Writing', 'Editorial Review', 'Newsletter Ops', 'Research Summaries'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'content.ieee@nmamit.in',
    },
  },
  {
    id: 'likithraj',
    name: 'LIKITHRAJ',
    role: 'Content Core',
    division: 'Content Wing',
    dept: 'Information Science Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94843',
    image: 'src/imgs/LIKITHRAJ.png',
    bio: 'Passionate about content creation, communication, and contributing to the IEEE Student Branch initiatives.',
    skills: ['Content Writing', 'Communication', 'Creative Strategy'],
    quote: 'Happy to work for IEEE',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'likithraj.ieee@nmamit.in',
    },
  },
  {
    id: 'abhishek-bhandary',
    name: 'Abhishek Bhandary',
    role: 'Logistics Lead',
    division: 'Operations',
    dept: 'Civil Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94836',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    bio: 'Coordinates inventory, venue equipment, procurement, and seamless stage infrastructure during large multi-day events.',
    skills: ['Supply Logistics', 'Asset Management', 'Stage Setup', 'On-ground Ops'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'logistics.ieee@nmamit.in',
    },
  },
  {
    id: 'tanvi-hegde',
    name: 'Tanvi Hegde',
    role: 'Sponsorship & Industry Relations',
    division: 'Media & Outreach',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94837',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    bio: 'Secures corporate sponsorships, hackathon prizes, API credits, and liaises with tech firms for industrial visits and talks.',
    skills: ['Corporate Pitching', 'Sponsorship Management', 'Contract Review', 'Networking'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'sponsor.ieee@nmamit.in',
    },
  },
  {
    id: 'darshan-shetty',
    name: 'Darshan Shetty',
    role: 'Competitive Coding Lead',
    division: 'Technology Wing',
    dept: 'Computer Science & Engineering',
    year: '2nd Year',
    memberId: 'IEEE STB-94838',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    bio: 'Directs the campus IEEEXtreme 24h programming squads and hosts weekly algorithmic problem solving sprints.',
    skills: ['Data Structures', 'C++', 'IEEEXtreme', 'Codeforces'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'coding.ieee@nmamit.in',
    },
  },
  {
    id: 'chinmayee-bhat',
    name: 'Chinmayee Bhat',
    role: 'Hardware & IoT Co-Lead',
    division: 'Technology Wing',
    dept: 'Electronics & Communication',
    year: '2nd Year',
    memberId: 'IEEE STB-94839',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Conducts hands-on soldering, PCB fabrication, and microcontroller programming sessions using ESP32 and STM32.',
    skills: ['PCB Design', 'KiCAD', 'ESP32', 'Sensor Networks'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'hardware.ieee@nmamit.in',
    },
  },
  {
    id: 'sankalp-poojary',
    name: 'Sankalp Poojary',
    role: 'AI / ML Co-Lead',
    division: 'Technology Wing',
    dept: 'Artificial Intelligence & Data Science',
    year: '2nd Year',
    memberId: 'IEEE STB-94840',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    bio: 'Hosts deep-learning workshops on computer vision, fine-tuning open-source LLMs, and model deployment.',
    skills: ['PyTorch', 'Transformers', 'Edge ML', 'Python'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'aiml.ieee@nmamit.in',
    },
  },
  {
    id: 'hrithik-prabhu',
    name: 'Hrithik Prabhu',
    role: 'Web Dev Co-Lead',
    division: 'Technology Wing',
    dept: 'Information Science & Engineering',
    year: '2nd Year',
    memberId: 'IEEE STB-94841',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Maintains web apps, hackathon leaderboard microservices, and student branch registration portals.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'webdev.sub@nmamit.in',
    },
  },
  {
    id: 'sumanth-rao',
    name: 'Sumanth Rao',
    role: 'Visual Media & Video Lead',
    division: 'Media & Outreach',
    dept: 'Computer & Communication Eng.',
    year: '2nd Year',
    memberId: 'IEEE STB-94842',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: 'Directs event after-movies, promotional teasers, video interviews, and photography documentation.',
    skills: ['Video Production', 'Premiere Pro', 'Photography', 'Motion Graphics'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'media.ieee@nmamit.in',
    },
  },
  {
    id: 'keerthana-nayak',
    name: 'Keerthana Nayak',
    role: 'Community & Outreach Co-Lead',
    division: 'Media & Outreach',
    dept: 'Computer Science & Engineering',
    year: '2nd Year',
    memberId: 'IEEE STB-94843',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    bio: 'Connects first-year students with student branch senior mentors, organizing branch orientation camps.',
    skills: ['Community Care', 'Mentorship', 'Student Orientation', 'Publicity'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'outreach.ieee@nmamit.in',
    },
  },
  {
    id: 'akash-kudva',
    name: 'Akash Kudva',
    role: 'Student Branch Webmaster',
    division: 'Technology Wing',
    dept: 'Computer Science & Engineering',
    year: '2nd Year',
    memberId: 'IEEE STB-94844',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Manages DNS, deployments, security updates, and performance tuning for IEEE NMAMIT web systems.',
    skills: ['DevOps', 'Vercel / Cloudflare', 'Web Performance', 'Git'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'webmaster@nmamit.in',
    },
  },
  {
    id: 'dr-jyothi-s',
    name: 'Dr. Jyothi S.',
    role: 'Student Branch Counselor',
    division: 'Faculty Advisory',
    dept: 'Professor, Dept. of Computer Science',
    year: 'Faculty Counselor',
    memberId: 'IEEE Senior Member #41829',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Faculty counselor providing academic oversight, steering branch initiatives, and linking student leadership with IEEE Section leadership.',
    skills: ['Research Mentorship', 'Academic Advisory', 'Faculty Liaison', 'IEEE Senior Member'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'counselor.ieee@nmamit.in',
    },
  },
];

// ============================================================================
// MAIN TEAM PAGE COMPONENT
// ============================================================================
export default function TeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0); // Starts on President (index 0)
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resetTimerKey, setResetTimerKey] = useState(0);
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);
  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef(null);

  const resetTimer = useCallback(() => {
    setResetTimerKey((prev) => prev + 1);
  }, []);

  // Detect mobile screen width for responsive 3D math
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Auto-slide: advances every 3s, loops back to start after the last card.
  // Pauses ONLY when a member details popup is open.
  useEffect(() => {
    if (selectedMember) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CORE_TEAM_MEMBERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedMember, resetTimerKey]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    resetTimer();
  }, [resetTimer]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(CORE_TEAM_MEMBERS.length - 1, prev + 1));
    resetTimer();
  }, [resetTimer]);

  const goToIndex = (index) => {
    setCurrentIndex(Math.max(0, Math.min(CORE_TEAM_MEMBERS.length - 1, index)));
    resetTimer();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMember) {
        if (e.key === 'Escape') {
          setSelectedMember(null);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedMember]);

  // Touch gesture support
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  // Trackpad / Mouse wheel horizontal scrub
  const handleWheel = (e) => {
    // Only intercept if we're not inside the open modal
    if (selectedMember) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      wheelAccumulator.current += e.deltaX;

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);

      if (Math.abs(wheelAccumulator.current) > 50) {
        if (wheelAccumulator.current > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        wheelAccumulator.current = 0;
      }

      wheelTimeout.current = setTimeout(() => {
        wheelAccumulator.current = 0;
      }, 150);
    }
  };

  // Card click: re-center and zoom into modal
  const handleCardClick = (member, index) => {
    setCurrentIndex(index);
    setSelectedMember(member);
    resetTimer();
  };

  const activeMember = CORE_TEAM_MEMBERS[currentIndex];
  const selectedTheme = selectedMember ? getDepartmentTheme(selectedMember.role) : null;

  return (
    <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans selection:bg-[#00629B] selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Architectural Grid & Subtle Vignette */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Header bar / Top Nav */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-[#5db4e8] font-bold text-xs">
            IE
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              IEEE NMAMIT
            </h1>
            <p className="text-[10px] text-zinc-400 tracking-wider uppercase">
              Core Committee · 2026–2027
            </p>
          </div>
        </div>

        {/* Plain text label */}
        <div className="text-xs text-zinc-400 font-semibold tracking-wider uppercase">
          25 Leaders
        </div>
      </header>

      {/* Main Stage: Horizontal Barrel Carousel */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-4 select-none">
        {/* Intro Tag & Eyebrow */}
        <div className="text-center mb-2 sm:mb-3 px-4">
          <p className="text-xs uppercase tracking-wider text-[#5db4e8] font-semibold mb-1">
            EXECUTIVE COMMITTEE &amp; LEADS
          </p>
        </div>

        {/* 3D Barrel Carousel Stage */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onWheel={handleWheel}
          className="relative w-full max-w-5xl h-[390px] sm:h-[420px] flex items-center justify-center"
          style={{ perspective: isMobile ? '850px' : '1200px' }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-3 sm:left-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
              currentIndex === 0
                ? 'border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 active:scale-95'
            }`}
            aria-label="Previous member"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === CORE_TEAM_MEMBERS.length - 1}
            className={`absolute right-3 sm:right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
              currentIndex === CORE_TEAM_MEMBERS.length - 1
                ? 'border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 active:scale-95'
            }`}
            aria-label="Next member"
          >
            <ChevronRight size={20} />
          </button>

          {/* 3D Drum Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {CORE_TEAM_MEMBERS.map((member, index) => {
              const offset = index - currentIndex;

              if (Math.abs(offset) > 4) return null;

              const theme = getDepartmentTheme(member.role);
              const isCore = isCoreMember(member.role);

              const angleStep = isMobile ? 22 : 18;
              const spacingStep = isMobile ? 180 : 240;
              const depthStep = isMobile ? 65 : 80;
              const scaleStep = isMobile ? 0.08 : 0.06;

              const rotateY = -offset * angleStep;
              const translateX = offset * spacingStep;
              const translateZ = -Math.abs(offset) * depthStep;
              const scale = Math.max(0.7, 1 - Math.abs(offset) * scaleStep);
              const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.22);
              const isCenter = offset === 0;

              return (
                <div
                  key={member.id}
                  onClick={() => handleCardClick(member, index)}
                  className={`absolute cursor-pointer transition-all duration-[0.4s] ease-out will-change-transform ${
                    isCenter ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    transformOrigin: 'center center',
                    opacity: opacity,
                    transitionDuration: '0.4s',
                  }}
                >
                  {/* Simple Flat Profile Card */}
                  <div
                    className={`group relative w-[260px] sm:w-[290px] h-[350px] sm:h-[380px] rounded-lg transition-all duration-[0.4s] flex flex-col overflow-hidden ${
                      isCenter
                        ? `bg-zinc-900 border-2 ${theme.activeBorder}`
                        : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                    }`}
                    style={{
                      maxHeight: 'min(380px, 60vh)',
                    }}
                  >
                    {/* Photo Section */}
                    <div className="relative w-full h-[210px] sm:h-[235px] overflow-hidden bg-zinc-800 shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top sm:object-center"
                        loading="lazy"
                      />
                    </div>

                    {/* Plain Text Labels & Info */}
                    <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                      <div className="flex flex-col items-center text-center w-full">
                        {/* Name */}
                        <h3
                          className={`leading-tight mb-1 truncate w-full text-center ${
                            isCore
                              ? 'text-lg sm:text-[1.2rem] font-extrabold text-white'
                              : `text-base sm:text-[1.05rem] font-bold ${
                                  isCenter ? 'text-white' : 'text-zinc-200'
                                }`
                          }`}
                        >
                          {member.name.replace(/\n/g, ' ').trim()}
                        </h3>

                        {/* Designation */}
                        <p
                          className={`text-[1.1rem] font-bold ${theme.roleText} mb-0.5 truncate w-full text-center`}
                        >
                          {member.role.trim()}
                        </p>

                        {/* Department / Year */}
                        <p className="text-[0.95rem] text-zinc-400 truncate w-full text-center">
                          {formatDeptYear(member.dept, member.year)}
                        </p>
                      </div>

                      {/* Footer Row */}
                      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between mt-1.5 w-full">
                        <span className="text-xs text-zinc-400 truncate max-w-[130px]">
                          {member.division}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#00629B] dark:text-[#38bdf8] font-semibold group-hover:underline">
                          <span>View Details</span>
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plain Text Position Label */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <span>{currentIndex + 1} of {CORE_TEAM_MEMBERS.length}</span>
          <span>·</span>
          <span className={`font-bold ${getDepartmentTheme(activeMember?.role).roleText}`}>
            {activeMember?.role?.trim()}
          </span>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-20 py-4 border-t border-zinc-900 bg-[#040507]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} IEEE Student Branch NMAMIT · Team Directory</p>
          <p className="flex items-center gap-1 text-zinc-400">
            <span>NMAM Institute of Technology, Nitte</span>
          </p>
        </div>
      </footer>

      {/* =====================================================================
          EXPANDED MEMBER PROFILE MODAL
          ===================================================================== */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/85 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setSelectedMember(null)}
        >
          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="cursor-default relative w-full max-w-xl rounded-2xl bg-[#0a0d16] border border-zinc-700/80 p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden"
          >
            {/* Ambient accent inside modal */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#00629B]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(null);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 p-2 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer shadow-sm"
              aria-label="Close profile modal"
            >
              <X size={18} className="pointer-events-none" />
            </button>

            {/* Profile Content */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
              {/* Large Photo */}
              <div className="relative shrink-0">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-2 ${selectedTheme?.activeBorder || 'border-[#00629B]'}`}
                />
                <span className="block mt-1.5 text-center text-xs text-zinc-400 font-medium">
                  ID: {selectedMember.memberId}
                </span>
              </div>

              {/* Name, Role & Details */}
              <div className="flex-1 pr-10 sm:pr-12">
                <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                  {selectedMember.division}
                </p>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {selectedMember.name}
                </h2>
                <div className={`text-sm font-semibold flex items-center gap-1.5 mt-0.5 ${selectedTheme?.roleText || 'text-[#5db4e8]'}`}>
                  <Award size={15} />
                  <span>{selectedMember.role}</span>
                </div>

                <div className="mt-2 text-xs text-zinc-400 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-zinc-500" />
                    <span>{selectedMember.dept}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-zinc-500" />
                    <span>{selectedMember.year}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                Executive Overview &amp; Focus
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {selectedMember.bio}
              </p>
            </div>

            {/* Skills & Focus Areas */}
            {selectedMember.skills && selectedMember.skills.length > 0 && (
              <div className="relative z-10 mt-5">
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                  Focus Areas &amp; Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links & Action Row */}
            <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {getSocialUrl('linkedin', selectedMember.socials?.linkedin) && (
                  <a
                    href={getSocialUrl('linkedin', selectedMember.socials?.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] transition-transform duration-200 hover:scale-110 hover:opacity-85 inline-flex items-center justify-center"
                    aria-label="LinkedIn profile"
                  >
                    <FaLinkedin size={26} />
                  </a>
                )}
                {getSocialUrl('github', selectedMember.socials?.github) && (
                  <a
                    href={getSocialUrl('github', selectedMember.socials?.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#181717] dark:text-white transition-transform duration-200 hover:scale-110 hover:opacity-85 inline-flex items-center justify-center"
                    aria-label="GitHub profile"
                  >
                    <FaGithub size={26} />
                  </a>
                )}
                {getSocialUrl('email', selectedMember.socials?.email) && (
                  <a
                    href={getSocialUrl('email', selectedMember.socials?.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EA4335] transition-transform duration-200 hover:scale-110 hover:opacity-85 inline-flex items-center justify-center"
                    aria-label="Gmail"
                  >
                    <SiGmail size={25} />
                  </a>
                )}
              </div>

              {selectedMember.socials?.email && selectedMember.socials.email !== '-' && (
                <a
                  href={`mailto:${selectedMember.socials.email}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-semibold transition-colors"
                >
                  <span>Connect via Email</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

