import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Single shared Lenis instance for buttery smooth scrolling and a GSAP
 * ticker hookup so ScrollTrigger animations stay in sync with the smooth
 * scroll position. Mount once near the app root.
 */
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisInstance = lenis;

    // Tie Lenis scroll → ScrollTrigger.update so GSAP scroll triggers fire
    // against the smoothed scroll position rather than the native one.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from the GSAP ticker so both share one rAF loop.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}
