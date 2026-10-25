import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './motion';

let lenisInstance = null;

export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null; // Fallback to native scroll entirely

  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2, // Floaty, Apple-style inertia
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Recommended default exponential ease-out
    smoothWheel: true,
    smoothTouch: false, // Don't override native touch momentum
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  // Sync GSAP ScrollTrigger with Lenis
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Drive Lenis's raf via GSAP's central ticker (prevents duplicate rAF loops)
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });
  
  // Ensure GSAP ticker runs independently of requestAnimationFrame if needed
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
};

export const getLenis = () => lenisInstance;

export const destroySmoothScroll = () => {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};
