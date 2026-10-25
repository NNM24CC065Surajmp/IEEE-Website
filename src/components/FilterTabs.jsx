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
        className="absolute h-8 bg-slate-900 dark:bg-zinc-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-black/50 border border-slate-800 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
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
                ? 'text-white dark:text-white' 
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
