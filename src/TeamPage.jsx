import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Linkedin,
  Github,
  Instagram,
  Mail,
  ExternalLink,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
  Code2,
  Cpu,
} from 'lucide-react';

/**
 * ============================================================================
 * IEEE Student Branch NMAMIT - Team Page Component
 * ============================================================================
 * 
 * Pattern: 3D Horizontal Barrel / Drum Rotation Carousel
 * Physics: Cylinder lying on its horizontal axis, cards curve away on the left & right
 * Theme: Editorial dark (#05070a), IEEE Teal/Blue (#00629B, highlight #5db4e8)
 * 
 * NOTES FOR DEVELOPERS:
 * - The team array below contains ~25 realistic placeholder records.
 * - Replace placeholder avatars, bios, and social handles with real branch data when available.
 */

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
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);
  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef(null);

  // Detect mobile screen width for responsive 3D math
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(CORE_TEAM_MEMBERS.length - 1, prev + 1));
  }, []);

  const goToIndex = (index) => {
    setCurrentIndex(Math.max(0, Math.min(CORE_TEAM_MEMBERS.length - 1, index)));
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
  };

  const activeMember = CORE_TEAM_MEMBERS[currentIndex];

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
      {/* Subtle radial ambient blue glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00629B]/[0.12] via-transparent to-transparent" />

      {/* Header bar / Top Nav */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center text-[#5db4e8] font-mono font-bold text-xs">
            IE
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              IEEE NMAMIT
            </h1>
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              Core Committee · 2025–2026
            </p>
          </div>
        </div>

        {/* Minimal status tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>25 Leaders</span>
        </div>
      </header>

      {/* Main Stage: Horizontal Barrel Carousel */}
      <main
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-6 select-none"
      >
        {/* Intro Tag & Eyebrow */}
        <div className="text-center mb-6 px-4">
          <div className="text-[11px] font-mono tracking-widest text-[#5db4e8] uppercase mb-1">
            EXECUTIVE COMMITTEE & LEADS
          </div>
        </div>

        {/* 3D Barrel Carousel Stage */}
        <div
          className="relative w-full max-w-5xl h-[310px] sm:h-[350px] flex items-center justify-center"
          style={{ perspective: isMobile ? '850px' : '1200px' }}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-3 sm:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0
                ? 'border-zinc-800/50 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                : 'border-zinc-700/80 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
            }`}
            aria-label="Previous member"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === CORE_TEAM_MEMBERS.length - 1}
            className={`absolute right-3 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 ${
              currentIndex === CORE_TEAM_MEMBERS.length - 1
                ? 'border-zinc-800/50 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                : 'border-zinc-700/80 bg-zinc-900/90 text-zinc-300 hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
            }`}
            aria-label="Next member"
          >
            <ChevronRight size={22} />
          </button>

          {/* 3D Drum Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {CORE_TEAM_MEMBERS.map((member, index) => {
              const offset = index - currentIndex;

              // Only render cards within visible offset window to maximize performance
              if (Math.abs(offset) > 4) return null;

              // Horizontal Barrel Physics:
              // R: radius of horizontal drum
              // theta: rotation around Y-axis (curves cards away on left and right)
              // translateZ: cards recede as they curve away from the front plane
              // translateX: horizontal spread along the cylindrical face
              const angleStep = isMobile ? 22 : 18; // degrees per card
              const spacingStep = isMobile ? 180 : 255; // pixels per card
              const depthStep = isMobile ? 65 : 85; // pixels receding in depth
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
                  className={`absolute cursor-pointer transition-all duration-300 ease-out will-change-transform ${
                    isCenter ? 'z-30' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    transformOrigin: 'center center',
                    opacity: opacity,
                  }}
                >
                  {/* The Profile Card */}
                  <div
                    className={`relative w-[310px] sm:w-[380px] h-[195px] sm:h-[230px] rounded-xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                      isCenter
                        ? 'bg-[#0a0d16] border-2 border-[#00629B] shadow-[0_0_35px_rgba(0,98,155,0.25)] ring-1 ring-[#5db4e8]/30'
                        : 'bg-[#080a11]/90 border border-zinc-800/90 hover:border-zinc-700'
                    }`}
                  >
                    {/* Background subtle watermark icon */}
                    <div className="absolute right-[-10px] bottom-[-10px] text-zinc-800/15 pointer-events-none">
                      <ShieldCheck size={120} />
                    </div>

                    {/* Top Row: Avatar + Role Badge */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border transition-colors ${
                              isCenter
                                ? 'border-[#00629B] shadow-sm shadow-[#00629B]/50'
                                : 'border-zinc-700'
                            }`}
                            loading="lazy"
                          />
                          {isCenter && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00629B] border-2 border-[#0a0d16] flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#5db4e8]" />
                            </span>
                          )}
                        </div>

                        {/* Name & Dept */}
                        <div>
                          <h3
                            className={`font-bold tracking-tight text-base sm:text-lg transition-colors leading-tight ${
                              isCenter ? 'text-white' : 'text-zinc-200'
                            }`}
                          >
                            {member.name}
                          </h3>
                          <p className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate max-w-[170px]">
                            {member.dept}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {member.year}
                          </span>
                        </div>
                      </div>

                      {/* Division Pill */}
                      <span
                        className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border whitespace-nowrap ${
                          isCenter
                            ? 'border-[#00629B]/70 bg-[#00629B]/20 text-[#5db4e8]'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                        }`}
                      >
                        {member.division}
                      </span>
                    </div>

                    {/* Bottom Row: Official Title & Click Prompt */}
                    <div className="relative z-10 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award
                          size={14}
                          className={isCenter ? 'text-[#5db4e8]' : 'text-zinc-500'}
                        />
                        <span
                          className={`text-xs font-semibold tracking-wide ${
                            isCenter ? 'text-zinc-100' : 'text-zinc-400'
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200">
                        <span>Details</span>
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Position Scrubber / Indicator Below Barrel */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Position count */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-zinc-400">INDEX</span>
            <span className="text-white font-bold tracking-wider px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              {String(currentIndex + 1).padStart(2, '0')} / {String(CORE_TEAM_MEMBERS.length).padStart(2, '0')}
            </span>
            <span className="text-zinc-400 hidden sm:inline">·</span>
            <span className="text-[#5db4e8] font-medium hidden sm:inline">
              {activeMember?.role}
            </span>
          </div>

          {/* Clickable mini scrub-dots */}
          <div className="flex items-center gap-1.5 max-w-[85vw] overflow-x-auto py-1 px-2 no-scrollbar">
            {CORE_TEAM_MEMBERS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={`Jump to ${CORE_TEAM_MEMBERS[i].name}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? 'w-6 bg-[#5db4e8]'
                    : 'w-1.5 bg-zinc-800 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="relative z-20 py-4 border-t border-zinc-900 bg-[#040507]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/85 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl bg-[#0a0d16] border border-zinc-700/80 p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden"
          >
            {/* Ambient accent inside modal */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#00629B]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              aria-label="Close profile modal"
            >
              <X size={18} />
            </button>

            {/* Profile Content */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
              {/* Large Photo */}
              <div className="relative shrink-0">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-[#00629B] shadow-lg shadow-[#00629B]/30"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 whitespace-nowrap">
                  {selectedMember.memberId}
                </span>
              </div>

              {/* Name, Role & Details */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#5db4e8] uppercase mb-1">
                  <span>{selectedMember.division}</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {selectedMember.name}
                </h2>
                <div className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5 mt-0.5">
                  <Award size={15} className="text-[#5db4e8]" />
                  <span>{selectedMember.role}</span>
                </div>

                <div className="mt-2 text-xs font-mono text-zinc-400 space-y-0.5">
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
            <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800/80">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Executive Overview & Focus
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {selectedMember.bio}
              </p>
            </div>

            {/* Skills & Focus Areas */}
            <div className="relative z-10 mt-5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Focus Areas & Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links & Action Row */}
            <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <a
                  href={selectedMember.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={selectedMember.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={15} />
                </a>
                <a
                  href={selectedMember.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href={`mailto:${selectedMember.socials.email}`}
                  className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail size={15} />
                </a>
              </div>

              <a
                href={`mailto:${selectedMember.socials.email}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                <span>Connect via Email</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

