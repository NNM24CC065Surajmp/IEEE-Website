import React, { useRef, useState, useEffect } from 'react';

export default function FilterTabs({ options, selected, onChange, ariaLabel }) {
  const wrapperRef = useRef(null);
  const activePillRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, left: 0, width: 0 });

  const updateIndicator = () => {
    if (activePillRef.current && wrapperRef.current) {
      const parentRect = wrapperRef.current.getBoundingClientRect();
      const childRect = activePillRef.current.getBoundingClientRect();
      setIndicatorStyle({
        opacity: 1,
        left: childRect.left - parentRect.left,
        width: childRect.width,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [selected, options]);

  return (
    <div 
      className="relative flex items-center overflow-x-auto no-scrollbar py-1"
      ref={wrapperRef}
      role="tablist"
      aria-label={ariaLabel || "Filter tabs"}
    >
      <div 
        className="absolute h-[34px] sm:h-[38px] rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-white/10 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:backdrop-blur-md bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/50"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          opacity: indicatorStyle.opacity,
          transform: 'translateY(-50%)',
          top: '50%'
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-1 sm:gap-2 px-1">
        {options.map((opt) => (
          <button
            key={opt}
            role="tab"
            aria-selected={selected === opt}
            ref={selected === opt ? activePillRef : null}
            onClick={() => onChange(opt)}
            className={`relative z-10 px-4 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-widest font-bold transition-colors duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue ${
              selected === opt 
                ? 'text-ieee-blue dark:text-white' 
                : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
