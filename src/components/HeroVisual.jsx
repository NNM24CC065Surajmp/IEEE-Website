import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { TrendingUp } from 'lucide-react';

const codeLines = [
  [
    { text: "const ", color: "text-ieee-accent" },
    { text: "App ", color: "text-blue-400 dark:text-blue-300" },
    { text: "= () ", color: "text-ieee-accent" },
    { text: "=> {", color: "text-slate-700 dark:text-slate-300" }
  ],
  [
    { text: "  const ", color: "text-ieee-accent" },
    { text: "[", color: "text-slate-700 dark:text-slate-300" },
    { text: "users", color: "text-slate-900 dark:text-blue-100" },
    { text: ", ", color: "text-slate-700 dark:text-slate-300" },
    { text: "setUsers", color: "text-blue-500 dark:text-blue-300" },
    { text: "] = ", color: "text-slate-700 dark:text-slate-300" },
    { text: "useState", color: "text-blue-500 dark:text-blue-400" },
    { text: "(", color: "text-slate-700 dark:text-slate-300" },
    { text: "1024", color: "text-amber-600 dark:text-amber-400" },
    { text: ");", color: "text-slate-700 dark:text-slate-300" }
  ],
  [
    { text: "  ", color: "" },
    { text: "// Render dashboard", color: "text-slate-500 dark:text-ieee-muted" }
  ],
  [
    { text: "  return ", color: "text-ieee-accent" },
    { text: "(", color: "text-slate-700 dark:text-slate-300" }
  ],
  [
    { text: "    <", color: "text-slate-400" },
    { text: "Dashboard", color: "text-teal-600 dark:text-teal-400" },
    { text: " data", color: "text-blue-500 dark:text-blue-200" },
    { text: "=", color: "text-slate-700 dark:text-slate-300" },
    { text: "{", color: "text-slate-400" },
    { text: "users", color: "text-slate-900 dark:text-blue-100" },
    { text: "}", color: "text-slate-400" },
    { text: " />", color: "text-slate-400" }
  ],
  [
    { text: "  );", color: "text-slate-700 dark:text-slate-300" }
  ],
  [
    { text: "}", color: "text-slate-700 dark:text-slate-300" }
  ]
];

export default function HeroVisual() {
  const containerRef = useRef(null);
  const laptopRef = useRef(null);
  const lightRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set('.code-token', { opacity: 1 });
      gsap.set('.cursor-block', { display: 'none' });
      return;
    }

    gsap.set('.code-token', { opacity: 0 });
    
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    tl.to('.code-token', {
      opacity: 1,
      duration: 0.05,
      stagger: 0.1,
      ease: 'none',
      onStart: () => gsap.set('.cursor-block', { opacity: 1 }),
      onComplete: () => gsap.set('.cursor-block', { opacity: 0 })
    });

    tl.to('.preview-pane', {
      scale: 1.02,
      duration: 0.15,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    }, "+=0.3");

    tl.fromTo('.preview-skeleton', {
      opacity: 0.3,
      backgroundColor: 'rgb(56 189 248)' 
    }, {
      opacity: 1,
      backgroundColor: '', 
      duration: 0.4,
      stagger: 0.05,
      clearProps: 'backgroundColor',
      ease: 'power2.out'
    }, "-=0.2");

    tl.to('.code-token', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      delay: 1.5
    });

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      
      // Initialize light sweep rotation and centering via GSAP so it handles the transform matrix
      gsap.set(lightRef.current, { rotation: -30, xPercent: -50, yPercent: -50 });

      const rotateXSetter = gsap.quickTo(laptopRef.current, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYSetter = gsap.quickTo(laptopRef.current, 'rotateY', { duration: 0.6, ease: 'power3.out' });
      const lightXSetter = gsap.quickTo(lightRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
      const lightYSetter = gsap.quickTo(lightRef.current, 'y', { duration: 0.4, ease: 'power3.out' });

      const parallaxEls = gsap.utils.toArray('[data-depth]', containerRef.current);
      const parallaxSetters = parallaxEls.map(el => ({
        x: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
        depth: parseFloat(el.dataset.depth)
      }));

      const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        rotateYSetter(nx * 8);
        rotateXSetter(ny * -8);

        lightXSetter(e.clientX - rect.left);
        lightYSetter(e.clientY - rect.top);

        parallaxSetters.forEach(setter => {
          setter.x(nx * 15 * setter.depth);
          setter.y(ny * 15 * setter.depth);
        });
      };

      const handleMouseEnter = () => {
        gsap.to(lightRef.current, { opacity: 1, duration: 0.3 });
      };

      const handleMouseLeave = () => {
        rotateXSetter(0);
        rotateYSetter(0);
        gsap.to(lightRef.current, { opacity: 0, duration: 0.5 });
        
        parallaxSetters.forEach(setter => {
          setter.x(0);
          setter.y(0);
        });
      };

      const container = containerRef.current;
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-[440px] lg:max-w-[560px] mx-auto aspect-[16/10] my-8 lg:my-0 lg:-mt-4 select-none animate-float motion-reduce:animate-none"
      aria-hidden="true"
    >
      {/* Background Glow Layer - overlapping blobs for a richer feel */}
      <div data-depth="0.1" className="absolute top-[40%] left-[10%] w-[100%] h-[100%] bg-ieee-blue/20 blur-[70px] rounded-full -z-20 pointer-events-none" />
      <div data-depth="0.15" className="absolute top-[60%] left-[40%] w-[80%] h-[80%] bg-ieee-teal/15 blur-[60px] rounded-full -z-20 pointer-events-none" />

      {/* 3D Perspective Wrapper */}
      <div style={{ perspective: '1200px' }} className="w-full h-full relative">
        
        {/* Tilt Container */}
        <div 
          ref={laptopRef} 
          style={{ transformStyle: 'preserve-3d' }} 
          className="relative w-full h-full flex flex-col items-center shadow-[0_4px_10px_rgba(0,0,0,0.2),_0_20px_40px_-10px_rgba(0,0,0,0.4),_0_40px_80px_-20px_rgba(0,0,0,0.5)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.3),_0_20px_40px_-10px_rgba(0,0,0,0.6),_0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-t-xl sm:rounded-t-2xl rounded-b-xl sm:rounded-b-3xl"
        >
          
          {/* Foreground Sticker */}
          <div data-depth="1.5" className="absolute -top-3 -right-3 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-xl text-[10px] font-bold text-teal-600 dark:text-teal-400 z-30 flex items-center gap-1.5 transform rotate-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" /> Live
          </div>

          <div className="w-full flex-grow bg-white dark:bg-[#0a0d14] border-[4px] sm:border-[6px] border-slate-300 dark:border-slate-800/80 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#121623] dark:via-[#0a0d14] dark:to-[#121623] rounded-t-xl sm:rounded-t-2xl overflow-hidden flex flex-col relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_inset_0_0_0_1px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            
            {/* Screen Reflection Light Sweep (Cursor-tracked) */}
            <div 
              ref={lightRef} 
              className="absolute top-0 left-0 w-96 h-48 rounded-[100%] pointer-events-none opacity-0 z-50 mix-blend-overlay"
              style={{
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0) 70%)"
              }}
            />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-300 dark:bg-slate-800/80 rounded-b-md flex justify-center items-center z-20 shadow-sm">
              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-900" />
            </div>

            <div className="flex flex-row w-full h-full overflow-hidden bg-slate-50 dark:bg-ieee-surface relative">
              
              {/* Static Ambient Glass Sheen (Subtle) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.06] pointer-events-none mix-blend-overlay z-40" />
              
              <div className="w-[55%] h-full border-r border-slate-200 dark:border-slate-800/50 flex flex-col bg-[#fafafa] dark:bg-[#0d111a] relative z-10">
                <div className="flex items-center gap-1.5 px-3 h-8 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/50 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 dark:bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500/80" />
                  <div className="ml-2 px-2 py-0.5 text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-sm shadow-sm border border-slate-200 dark:border-slate-700">
                    app.jsx
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 text-[10px] sm:text-[11px] md:text-xs font-mono leading-relaxed overflow-hidden">
                  {codeLines.map((line, i) => (
                    <div key={i} className="whitespace-pre flex flex-wrap">
                      {line.map((token, j) => (
                        <span key={j} className={`code-token ${token.color}`}>
                          {token.text}
                        </span>
                      ))}
                      {i === codeLines.length - 1 && (
                        <span className="cursor-block inline-block w-1.5 h-3 sm:h-3.5 bg-ieee-blue dark:bg-ieee-teal ml-0.5 animate-blink motion-reduce:animate-none" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-[45%] h-full bg-slate-100 dark:bg-[#05060A] p-3 sm:p-4 flex flex-col gap-3 relative preview-pane z-10">
                <div data-depth="0.2" className="flex justify-between items-center preview-skeleton">
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>

                <div className="grid gap-2">
                  <div data-depth="0.4" className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-2.5 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] preview-skeleton">
                    <div className="text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 opacity-80">
                      Active Users
                    </div>
                    <div data-depth="1.2" className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-none mt-1">
                      1,024
                    </div>
                  </div>
                  
                  <div data-depth="0.5" className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-2.5 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] preview-skeleton">
                    <div className="text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 opacity-80">
                      Growth Rate
                    </div>
                    <div data-depth="0.8" className="flex items-center gap-1.5 mt-1">
                      <TrendingUp className="text-teal-500/90 dark:text-teal-400/90" size={16} strokeWidth={3} />
                      <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">+24%</div>
                    </div>
                  </div>
                </div>

                <div data-depth="0.3" className="mt-auto flex flex-col gap-1 preview-skeleton">
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider opacity-80">
                    Weekly Activity
                  </span>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-lg p-2 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex items-end gap-1 h-12">
                    <div className="w-1/4 h-[40%] bg-blue-400/20 dark:bg-blue-900/40 rounded-t-sm" />
                    <div className="w-1/4 h-[60%] bg-blue-400/40 dark:bg-blue-800/40 rounded-t-sm" />
                    <div className="w-1/4 h-[80%] bg-blue-400/60 dark:bg-blue-700/40 rounded-t-sm" />
                    <div className="w-1/4 h-[100%] bg-ieee-blue dark:bg-ieee-teal/80 rounded-t-sm" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div data-depth="0.1" className="relative w-[112%] h-6 sm:h-8 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-800 border-t border-slate-400 dark:border-slate-800/50 rounded-b-xl sm:rounded-b-3xl rounded-t-[1px] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_-4px_10px_rgba(0,0,0,0.4)] flex justify-center z-0">
             <div className="absolute top-0 w-16 sm:w-20 h-1.5 bg-slate-400/50 dark:bg-slate-900/50 rounded-b-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
