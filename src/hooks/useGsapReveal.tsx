import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals elements with `[data-reveal]` inside the container as they
 * scroll into view. Stagger between siblings. Cinematic 0.9s ease.
 *
 * Use `data-reveal="title"` for a stronger from-below entrance,
 * `data-reveal="word"` for word-by-word stagger.
 */
export function useGsapReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Generic block reveal
      gsap.from(el.querySelectorAll("[data-reveal='block']"), {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          once: true,
        },
      });

      // Title reveal — stronger lift + slight scale
      gsap.from(el.querySelectorAll("[data-reveal='title']"), {
        y: 72,
        opacity: 0,
        scale: 0.985,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      });

      // Word-by-word stagger — wrap individual <span> children
      el.querySelectorAll("[data-reveal='words']").forEach((node) => {
        const spans = node.querySelectorAll(".reveal-word");
        if (spans.length === 0) return;
        gsap.from(spans, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: node as Element,
            start: "top 82%",
            once: true,
          },
        });
      });

      // Cards stagger
      gsap.from(el.querySelectorAll("[data-reveal='card']"), {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);
  return ref;
}

/**
 * Splits a string into <span class="reveal-word"> tokens for use with
 * `data-reveal='words'`. Preserves whitespace.
 */
export function splitWords(text: string) {
  return text.split(/(\s+)/).map((part, i) => {
    if (/^\s+$/.test(part)) return part;
    return (
      <span
        key={i}
        className="reveal-word inline-block will-change-transform"
      >
        {part}
      </span>
    );
  });
}
