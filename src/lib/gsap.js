import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { useGSAP } from '@gsap/react'; gsap.registerPlugin(ScrollTrigger, useGSAP); 
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

export { gsap, ScrollTrigger, useGSAP };
