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
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
} from 'lucide-react';


// Vite eager asset glob resolver for team profile pictures
const localImages = import.meta.glob('/src/imgs/*.{jpg,jpeg,png,webp,HEIC,JPG,PNG,jpeg,JPEG}', { eager: true, import: 'default' });

const getMemberImage = (imgPath) => {
  if (!imgPath) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;

  const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
  if (localImages[normalized]) return localImages[normalized];

  const fileName = normalized.split('/').pop().toLowerCase();
  for (const path in localImages) {
    if (path.toLowerCase().endsWith(fileName)) {
      return localImages[path];
    }
  }
  return imgPath;
};

const CORE_TEAM_MEMBERS = [
  {
    id: 'Mohammed-ajmal ',
    name: 'Mohammed  Ajmal ',
    role: 'President',
    division: 'Executive Committee',
    dept: 'Information Science & Engineering',
    year: 'Third Year',
    memberId: '101215214',
    image: "src/imgs/Azmal.jpg",
    bio: 'I am a tech enthusiastic and also a extrovert who loves discovering new topics and learning continuously ',
    quote:'My code works perfectly until a user touches it 😃',
    socials: {
      linkedin: 'https://www.linkedin.com/in/mohammed-ajmal-a3bb6533a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      github: 'https://github.com/nnm24is127-droid',
      email: 'azmalhack1@gmail.com',
    },
  },
  {
    id: 'ninaad-y',
    name:'Ninaad  Y',
    role:'Vice president ',
    division: 'Executive Committee',
    dept: 'Information Science engineering ',
    year: '3RD',
    memberId: '102268174',
    image:"src/imgs/Ninaad.jpg",
    bio: 'A dedicated programmer and national-level athlete who thrives on discipline, focus, and continuous growth. Passionate about coding, problem-solving, and building software solutions, with a creative side that enjoys exploring traditional culinary arts and analog cooking in free time.',
    quote: 'Don\'t try to be better than someone else. Just try to be better than you were yesterday.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ninaady?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      github: 'https://github.com/ninaad11',
      email: 'Prananyaninaad@gmail.com',
        },
    },

  {
    id: 'chandana-tp',
    name:'Chandana T P',
    role:'Secretary',
    division: 'Executive Committee',
    dept: 'Information Science and Technology',
    year: '2ND',
    memberId: '102726726',
    image:"src/imgs/Chandana T P_.jpg",
    bio: 'I am a confident and motivated Information Science and Technology student who enjoys learning, exploring new technologies, and taking on challenges. I am a quick learner, responsible, and a strong team player who is always ready to contribute, learn, and grow.',
    quote: 'TRY AND TRY ONE DAY YOU CAN FLY',
    socials: {
      linkedin: 'https://www.linkedin.com/in/chandana-t-p-046a04388?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      github: 'https://github.com/Chandanachandu0611-cloud',
      email: 'chandana.chandu.06.11@gmail.in',
      },
    },
   {
    id: 'trisha-s-shetty',
    name:'Trisha S Shetty',
    role:'Co Secretary ',
    division: 'Executive Committee',
    dept: 'Artificial intelligence and Data science ',
    year: '2ND',
    memberId: '102726570',
    image:"src/imgs/TRISHA S SHETTY.jpg" ,
    bio: 'If I had to describe myself in a few words I\'d say that  I\'ve always been interested in learning and trying different things rather than limiting myself to just one area.',
    quote: 'You are allowed to outgrow your own opinion, your own habits. The goal was never to stay the same. The goal was always to grow.',
    socials: {
      linkedin: 'Trisha S Shetty ',
      github: 'Trisha123236',
      email: 'tshetty014@gmail.com',
      },
    },

  {
    id:'suraj-m-p',
    name:'Suraj M P ',
    role:'Technical Head ',
    division: 'Executive Committee',
    dept: 'Computer and Communication Engineering ',
    year: '3RD',
    memberId: '102728615',
    image:"src/imgs/Suraj M P.png",
    bio: 'I’m someone who enjoys building things, exploring new ideas, and turning them into something real. I like taking responsibility, solving problems, and learning along the way.',
    quote: 'I make ideas work. Eventually.. ',
    socials: {
      linkedin: 'https://www.linkedin.com/in/suraj-m-p-b39001314?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      github: 'https://share.google/62ZTzBB4eUtjHD5Dl',
      email: 'suraj.mp15@gmail.com',
        },
    },

  {
    id:'aditya-kudva-k',
    name:'Aditya Kudva K',
    role:'Technical Co-Head ',
    division: 'Executive Committee',
    dept: 'CSE ',
    year: '2ND',
    memberId: '102728212',
    image:"src/imgs/Aditya Kudva K.jpg",
    bio: 'Tech Enthusiast who also enjoyes doing fun and madness filled life',
    quote: 'My life runs on two loops: while(alive) { engineer(); playGames(); }',
    socials: {
      linkedin: 'https://www.linkedin.com/in/aditya-kudva-k',
      github: 'kudva70',
      email: 'k.kudva70@gmail.com',
      },
    },
  {
        id:'madhuresh-kumar',
        name:'Madhuresh Kumar ',
        role:'Tech Team',
        division: 'Executive Committee',
        dept: 'ISE',
        year: '3RD',
        memberId: '102719051',
        image:"src/imgs/Madhuresh Kumar_.jpg",
        bio: 'I am a third-year Information Science student with a solid foundation in data structures, database management systems,and software development. Throughout my academic journey, I have developed strong analytical thinking and problem-solving skills, enabling me to design efficient, scalable, and reliable solutions. I have a keen interest in building data-driven applications that canaddress real-world challenges and create meaningful impact.',
        quote: 'Learn.Build.Fail.Improve.Repeat',
        socials: {
        linkedin: 'https://www.linkedin.com/in/madhuresh-kumar-539607320?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'https://github.com/Madhuresh01',
        email: 'kumarmadhuresh101@gmail.com',
        },
    },
    {
        id:'aadhish-balakrishna-salian',
        name:'Aadish Balakrishna Salian ',
        role:'Tech Team ',
        division: 'Executive Committee',
        dept: 'Computer Science and Engineering ',
        year: '3RD',
        memberId: '102716802',
        image:"src/imgs/Aadish Balakrishna Salian_.jpg",
        bio: 'I’m someone who loves turning “What if?” into “Let’s build it.” I enjoy experimenting with technology, solving problems, and constantly leveling up my skills.',
        quote: 'The world changes when imagination learns how to execute',
        socials: {
        linkedin: 'https://www.linkedin.com/in/aadish-balakrishna-salian-7191ba37b/',
        github: 'https://github.com/AadishSalian',
        email: 'salianaadish@gmail.com',
        },
    },
    {
        id:'anagha',
        name:'ANAGHA ',
        role:'Tech Team',
        division: 'Executive Committee',
        dept: 'INFORMATION SCIENCE AND ENGINEERING ',
        year: '2ND',
        memberId: '102726626',
        image:"src/imgs/ANAGHA.png",
        bio: 'Passionate about technology, innovation, and problem-solving, I enjoy turning ideas into practical solutions. Always curious to learn, build, and take on new challenges.',
        quote: '"My code works. Please don’t ask why"',
        socials: {
        linkedin: 'https://www.linkedin.com/in/anagha-b24960377?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'anagha15bhat-lang ',
        email: 'anagha15bhat@gmail.com',
        },
    },
    {
        id:'poorvi-m-mohare',
        name:'Poorvi M Mohare',
        role:'Treasurer ',
        division: 'Executive Committee',
        dept: 'Computer science and engineering ',
        year: '3RD',
        memberId: '102728168',
        image:"src/imgs/POORVI M MOHARE.jpg",
        bio: 'I’m passionate about learning new things and researching new skills.I’m responsible , hardworking and adaptable ',
        quote: 'Nothing ',
        socials: {
        linkedin: 'Poorvi m Mohare ',
        github: 'https://github.com/Poorvimmohare',
        email: 'poorvimmohare@gmail.com',
        },
    },
    {
        id:'prajwala-vasudev-gouda',
        name:'Prajwala Vasudev Gouda ',
        role:'Co-Treasurer ',
        division: 'Executive Committee',
        dept: 'Information science ',
        year: '3RD',
        memberId: '102712569',
        image:"src/imgs/Prajwala Gouda.jpg",
        bio: 'I’m a curious and enthusiastic person who loves learning new things, taking up challenges, and working with people. I enjoy coding, leading teams, and turning ideas into reality. I’m always excited to learn, contribute, and have some fun along the way! 😊',
        quote: '“Do it scared, do it anyway. A little chaos, a lot of curiosity.”',
        socials: {
        linkedin: 'prajwalagouda',
        github: 'prajwalagouda',
        email: 'prajwalavgouda@gmail.com',
        },
    },
    {
        id:'thaush-j',
        name:'THANUSH J',
        role:'Event Head',
        division: 'Executive Committee',
        dept: 'Cybersecurity ',
        year: '3RD',
        memberId: '102726413',
        image:"src/imgs/Thanush J.png",
        bio: 'Cybersecurity student. Tech enthusiast. Problem solver.Always curious, always learning, and I am Batman.',
        quote: 'Good morning, good afternoon, good evening, and good night!',
        socials: {
        linkedin: 'https://www.linkedin.com/in/thanush-j-a24495326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        github: 'https://github.com/ThanushJ46',
        email: 'mrthanush46@gmail.com',
        },
    },
    {
        id:'avismayi-hs-gowda',
        name:'Avismayi HS Gowda',
        role:'Event Co-Head',
        division: 'Executive Committee',
        dept: 'Information science ',
        year: '2ND',
        memberId: '102722101',
        image:"src/imgs/Avismayi HS Gowda_.jpg",
        bio: 'I’m a responsible, enthusiastic, and approachable person who enjoys taking initiative and being involved in new experiences. I’m a quick learner and enjoy working with people, especially in team-based activities. I like organizing and coordinating things, and I always try to give my best when I take up a responsibility. I’m also someone who is open to learning from others and continuously improving myself.',
        quote: 'You don’t have to be perfect, you just have to be willing to learn.',
        socials: {
        linkedin: 'Avismayi Gowda',
        github: 'Avismayi gowda',
        email: 'avismayigowda@gmail.com',
        },
    },
    {
        id:'tharun-v-shettigar',
        name:'Tharun V Shettigar ',
        role:'Events Team',
        division: 'Executive Committee',
        dept: 'Electrical And Electronics Engineering ',
        year: '3RD',
        memberId: '102731397',
        image:"src/imgs/Tharun V Shettigar .jpeg",
        bio: 'Curious,eager to learn ,life long learner',
        quote: 'Engineer: 1% inspiration, 99% troubleshooting',
        socials: {
        linkedin: 'https://www.linkedin.com/in/mr-tharun-v-shettigar-721630298?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'nnm24ee123-THARUN (nnm24ee123-THARUN)',
        email: 'tharunvshettigar@gmail.com',
        },
    },

{
        id:'karthik-shenoy',
        name:'Karthik Shenoy',
        role:'Events Team',
        division: 'Executive Committee',
        dept: 'Information science',
        year: '3RD',
        memberId: '102727640',
        image:"src/imgs/Karthik Shenoy_.jpg",
        bio: 'So what’s my story,it’s long twisted and not finished yet…',
        quote: 'I’ll figure it out somehow',
        socials: {
        linkedin: 'https://www.linkedin.com/in/karthik-shenoy-003423321?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
        github: 'https://github.com/karthikshenoy444',
        email: 'karthikshenoy433@gmail.com',
        },
    },
    {
        id:'nithish-s-kumar',
        name:'Nithish s kumar',
        role:'Head Design ',
        division: 'Executive Committee',
        dept: 'Information science ',
        year: '3RD',
        memberId: '102729613',
        image:"src/imgs/Nithish Kumar.png",
        bio: 'A curious, ambitious, and practical tech student who learns fast, loves hands-on work, and keeps things simple 🚀',
        quote: '    “My destination changes. My algorithm doesn’t.” ',
        socials: {
        linkedin: 'Nithish S Kumar',
        github: 'Nithishh21',
        email: 'simplejust793@gmail.com',
        },
    },
    {
        id:'haima-krishna',
        name:'Haima Krishna ',
        role:'Design Co-Head ',
        division: 'Executive Committee',
        dept: 'Robotics and AI ',
        year: '3RD',
        memberId: '101709272',
        image:"src/imgs/Haima Krishna_.jpg",
        bio: 'I’m Haima Krishna, a Robotics & AI Engineering student passionate about AI, computer vision, robotics, and industrial automation. I enjoy turning ideas into practical projects and exploring how intelligent technology can solve real-world problems.',
        quote: '“Dreams on my mind, deadlines behind"💀',
        socials: {
        linkedin: 'https://www.linkedin.com/in/haima-krishna-25h06?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'https://github.com/Haima18',
        email: 'krishnahaima3@gmail.com',
        },
    },
    {
        id:'mayur-r-shetty',
        name:'Mayur R Shetty',
        role:'Design Team ',
        division: 'Executive Committee',
        dept: 'ISE',
        year: '3RD',
        memberId: '102697701',
        image:"src/imgs/Mayur Shetty.jpg",
        bio: 'Creative and curious tech enthusiast who loves learning and building.',
        quote: 'Keep it simple, keep learning',
        socials: {
        linkedin: 'https://www.linkedin.com/in/mayur-r-shetty?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'https://github.com/mayurshettyy',
        email: 'mayurrshettyyy@gmail.com',
        },
    },
    {
        id:'anika-h-p',
        name:'Anika H P ',
        role:'Content Head ',
        division: 'Executive Committee',
        dept: 'Information science and engineering ',
        year: '2ND',
        memberId: '102726456',
        image:"src/imgs/Anika H P_.jpg",
        bio: 'I am a passionate and enthusiastic student with a strong interest in technology and creative problem-solving. I enjoy learning new technical skills, exploring innovative ideas, and working on projects that turn concepts into practical solutions. I am a quick learner, responsible team member, and good collaborator. As part of the Technical Team, I would like to contribute my skills,learn from others, and help the club successfully execute its technical projects and events.',
        quote: 'Where Ideas Find Their Voice',
        socials: {
        linkedin: 'anika-hp-44248a381',
        github: 'anikahp3001 ',
        email: 'anikahp3001@gmail.com',
        },
    },
    {
        id:'niharika-k-addoni',
        name:'Niharika K Addoni',
        role:'Content Co-Head',
        division: 'Executive Committee',
        dept: 'Information Science ',
        year: '3RD',
        memberId: '102727625',
        image:"src/imgs/Niharika K Addoni.jpg",
        bio: 'I am a creative, responsible, and enthusiastic person with good communication and teamwork skills. I enjoy event management, marketing, and exploring new ideas. I am always willing to learn, take initiative, and contribute positively to the team.',
        quote: 'Content Co-Head – 10% ideas, 90% “wait, let’s make it better”',
        socials: {
        linkedin: 'https://www.linkedin.com/in/niharika-k-addoni-23b89532a?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'niharikaaddoni https://share.google/QPAVB2QbrQdlGGUqX',
        email: 'niharikaaddoni10@gmail.com',
        },
    },
    {
        id:'neha-p-shetty',
        name:'Neha P Shetty ',
        role:'Content Co-Head',
        division: 'Executive Committee',
        dept: 'Ise',
        year: '3RD',
        memberId: '102729108',
        image:"src/imgs/Neha P Shetty.jpg",
        bio: 'I am a curious and enjoys learning new things.I have a strong interest in technology and exploring new ideas.I believe in improving myself continuously and gaining new experiences.I enjoy teamwork and aim to build a successful career through dedication.',
        quote: 'Content Co- head-10% planning "Wait let\'s Make it interesting" ',
        socials: {
        linkedin: 'https://www.linkedin.com/in/neha-p-shetty-41701a330?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'nehapshetty https://github.com/nehapshetty',
        email: 'nehapshetty13@gmail.com',
        },
    },
    {
        id:'bhavish-m-kumar',
        name:'Bhavish Kumar M ',
        role:'Marketing Head ',
        division: 'Executive Committee',
        dept: 'ECE(ACT)',
        year: '3RD',
        memberId: '102732308',
        image:"/src/imgs/Bhavish Kumar M_ .jpg",
        bio: 'Marketing Head at IEEE, always juggling multiple clubs and events.Into sports and I love turning ideas into things people actually notice and talk about.',
        quote: 'Marketing Head — 50% content creation, 50% chasing people for likes and shares.',
        socials: {
        linkedin: 'bhavish-kumar-m-27a3243a0 ',
        github: 'bhavishh07',
        email: 'Bhavishkumarm03@gmail.com',
        },
    },
    {
        id:'jiya-bawankar',
        name:'Jiya bawankar ',
        role:'Marketing Co-Head',
        division: 'Executive Committee',
        dept: 'Biotechnology ',
        year: '2ND',
        memberId: '102726797',
        image:"/src/imgs/Jiya bawankar_.png",
        bio: 'I’m a curious, creative, and enthusiastic person who enjoys learning new things and taking on new challenges. I’m currently pursuing B.Tech in Biotechnology, and I’m especially interested in combining my technical knowledge with creativity, communication, and teamwork. I’m someone who likes being involved in events and activities, takes responsibility seriously, and always tries toimprove myself. I would describe myself as adaptable, approachable, and willing to step out of my comfort zone to gain new experiences.',
        quote: '“Don’t wait for the right opportunity, create it.”',
        socials: {
        linkedin: 'https://www.linkedin.com/in/jiya-bawankar-ba174a379',
        github: '-',
        email: 'Jiyabawankar8@gmail.com',
        },
    },
    {
        id:'grahith-kumar-b',
        name:'Grahith Kumar B ',
        role:'Marketing Team ',
        division: 'Executive Committee',
        dept: 'Artificial intelligence and machine learning ',
        year: '3RD',
        memberId: '102729043',
        image:"src/imgs/Grahith Kumar B_.jpg",
        bio: 'I am an Artificial Intelligence and Machine Learning student with a strong interest in technology, marketing, and creative problem-solving. I enjoy learning new skills, working with teams, and taking part in projects and college activities that help me grow both technically and professionally.',
        quote: 'Success is not final, failure is not fatal; it is the courage to continue that counts.',
        socials: {
        linkedin: 'https://www.linkedin.com/in/grahith-kumar-b-395a5b325?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        github: 'https://github.com/Grahithkumar2006',
        email: 'grahithub2006@gmail.com',
        },
    },

];

export default function TeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);
  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, CORE_TEAM_MEMBERS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

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

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  const handleWheel = (e) => {
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

  const handleCardClick = (member, index) => {
    setCurrentIndex(index);
    setSelectedMember(member);
  };

  const activeMember = CORE_TEAM_MEMBERS[currentIndex];

  return (
    <div className="pt-28 sm:pt-36 pb-20 select-none">
      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
          EXECUTIVE COMMITTEE & LEADS · 2025–2026
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          The Engineers Behind IEEE NMAMIT
        </h1>
      </section>

      {/* 3D Barrel Carousel Stage */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative w-full max-w-6xl mx-auto h-[380px] sm:h-[430px] flex items-center justify-center my-4"
        style={{ perspective: isMobile ? '850px' : '1200px' }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 sm:left-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            currentIndex === 0
              ? 'border-slate-300/50 dark:border-zinc-800/50 bg-slate-200/30 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
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
          className={`absolute right-4 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            currentIndex === CORE_TEAM_MEMBERS.length - 1
              ? 'border-slate-300/50 dark:border-zinc-800/50 bg-slate-200/30 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
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

            if (Math.abs(offset) > 4) return null;

            const angleStep = isMobile ? 22 : 18;
            const spacingStep = isMobile ? 180 : 255;
            const depthStep = isMobile ? 65 : 85;
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
                {/* Top-Avatar Vertical Profile Card */}
                <div
                  className={`relative w-[280px] sm:w-[320px] h-[310px] sm:h-[340px] rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                    isCenter
                      ? 'bg-white dark:bg-[#0a0d16] border-2 border-[#00629B] shadow-[0_0_35px_rgba(0,98,155,0.3)] ring-1 ring-[#00629B]/40'
                      : 'bg-slate-100/95 dark:bg-[#080a11]/95 border border-slate-300 dark:border-zinc-800/90 hover:border-slate-400 dark:hover:border-zinc-700'
                  }`}
                >
                  {/* Decorative Background Shield Ornament */}
                  <div className="absolute right-[-20px] bottom-[-20px] text-slate-300/30 dark:text-zinc-800/15 pointer-events-none">
                    <ShieldCheck size={160} />
                  </div>

                  {/* TOP SECTION: Centered Top Profile Picture & Information */}
                  <div className="relative z-10 flex flex-col items-center text-center pt-1">
                    {/* Top Profile Picture Avatar */}
                    <div className="relative mb-3">
                      <img
                        src={getMemberImage(member.image)}
                        alt={member.name}
                        loading="eager"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                        }}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-center border-2 transition-all duration-300 ${
                          isCenter
                            ? 'border-[#00629B] shadow-lg shadow-[#00629B]/35 scale-105'
                            : 'border-slate-300 dark:border-zinc-700'
                        }`}
                      />
                      {isCenter && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#00629B] border-2 border-white dark:border-[#0a0d16] flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-[#0096D6]" />
                        </span>
                      )}
                    </div>

                    {/* Division Badge */}
                    <span
                      className={`text-[9px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full border font-semibold mb-2 ${
                        isCenter
                          ? 'border-[#00629B]/70 bg-[#00629B]/15 text-[#00629B] dark:text-[#5db4e8]'
                          : 'border-slate-300 dark:border-zinc-800 bg-slate-200/60 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {member.division}
                    </span>

                    {/* Member Name */}
                    <h3
                      className={`font-bold tracking-tight text-lg sm:text-xl transition-colors leading-tight mb-1 ${
                        isCenter ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      {member.name.replace(/\n/g, ' ')}
                    </h3>

                    {/* Dept & Year */}
                    <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate max-w-[240px]">
                      {member.dept}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                      {member.year}
                    </span>
                  </div>

                  {/* BOTTOM FOOTER: Role & View Details Action */}
                  <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award
                        size={14}
                        className={isCenter ? 'text-[#00629B] dark:text-[#5db4e8]' : 'text-slate-400 dark:text-zinc-500'}
                      />
                      <span
                        className={`text-xs font-semibold tracking-wide ${
                          isCenter ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#00629B] dark:text-[#5db4e8] font-bold group-hover:underline">
                      <span>View Details</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Indicator Below Barrel */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-500 dark:text-zinc-400">INDEX</span>
          <span className="text-slate-900 dark:text-white font-bold tracking-wider px-2.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 shadow-sm">
            {String(currentIndex + 1).padStart(2, '0')} / {String(CORE_TEAM_MEMBERS.length).padStart(2, '0')}
          </span>
          <span className="text-slate-400 dark:text-zinc-400 hidden sm:inline">·</span>
          <span className="text-[#00629B] dark:text-[#5db4e8] font-semibold hidden sm:inline">
            {activeMember?.role}
          </span>
        </div>

        <div className="flex items-center gap-1.5 max-w-[85vw] overflow-x-auto py-1 px-2 no-scrollbar">
          {CORE_TEAM_MEMBERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToIndex(i)}
              aria-label={`Jump to ${CORE_TEAM_MEMBERS[i].name}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === currentIndex
                  ? 'w-6 bg-[#00629B] dark:bg-[#5db4e8]'
                  : 'w-1.5 bg-slate-300 dark:bg-zinc-800 hover:bg-slate-400 dark:hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal Profile Zoom */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 dark:bg-black/85 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0a0d16] border border-slate-300 dark:border-zinc-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#00629B]/15 rounded-full blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
              aria-label="Close profile modal"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0">
                <img
                  src={getMemberImage(selectedMember.image)}
                  alt={selectedMember.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-[#00629B] shadow-lg shadow-[#00629B]/30"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 whitespace-nowrap font-bold">
                  {selectedMember.memberId}
                </span>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00629B] dark:text-[#5db4e8] uppercase mb-1 font-bold">
                  <span>{selectedMember.division}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {selectedMember.name}
                </h2>
                <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 mt-0.5">
                  <Award size={15} className="text-[#00629B] dark:text-[#5db4e8]" />
                  <span>{selectedMember.role}</span>
                </div>

                <div className="mt-2 text-xs font-mono text-slate-600 dark:text-zinc-400 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-slate-400 dark:text-zinc-500" />
                    <span>{selectedMember.dept}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-slate-400 dark:text-zinc-500" />
                    <span>{selectedMember.year}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800/80">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
                Executive Overview & Focus
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                {selectedMember.bio}
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800/80">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
                
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                {selectedMember.quote}
              </p>
            </div>
            

            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <a
                  href={selectedMember.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={selectedMember.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={15} />
                </a>
                
                <a 
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedMember.socials.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors" 
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
              </div>

              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
