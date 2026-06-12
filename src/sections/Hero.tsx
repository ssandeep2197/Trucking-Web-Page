import { useRef, useEffect } from "react";
import { ArrowRight, Radio } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteConfig } from "../lib/siteConfig";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dark text-only hero. No Three.js. Soft gradient orbs in the background
 * for atmosphere; GSAP word-by-word reveal on the headline.
 */
export default function Hero() {
  const { config } = useSiteConfig();
  const ref = useRef<HTMLDivElement>(null);
  const headlineLines = config.heroHeadline.split("\n");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-hero-pill]"), {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(root.querySelectorAll(".hero-word"), {
        y: 80,
        opacity: 0,
        duration: 1.0,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.05,
      });
      gsap.from(root.querySelectorAll("[data-hero-sub]"), {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from(root.querySelectorAll("[data-hero-cta]"), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.7,
      });
      gsap.from(root.querySelectorAll("[data-hero-stat]"), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 1.0,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink-950 pt-28 md:pt-32"
    >
      {/* Atmospheric washes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,138,77,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(60%_50%_at_80%_30%,rgba(92,176,255,0.12),transparent_70%)]" />

      {/* Soft dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(196,203,225,0.16) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(80% 55% at 50% 45%, black 0%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(80% 55% at 50% 45%, black 0%, transparent 85%)",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[22%] h-[440px] w-[440px] animate-pulse rounded-full bg-[radial-gradient(closest-side,_rgba(255,138,77,0.55)_0%,_rgba(255,138,77,0.08)_45%,_transparent_75%)] blur-2xl" />
        <div className="absolute right-[6%] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,_rgba(92,176,255,0.40)_0%,_rgba(92,176,255,0.06)_45%,_transparent_75%)] blur-2xl" />
        <div className="absolute left-[40%] top-[60%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,_rgba(167,139,250,0.32)_0%,_rgba(167,139,250,0.05)_45%,_transparent_75%)] blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl">
          <div data-hero-pill className="pill-ember">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
            {config.heroEyebrow}
          </div>

          <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-tight text-cream-50 md:text-[80px]">
            {headlineLines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                {line.split(/(\s+)/).map((word, j) =>
                  /^\s+$/.test(word) ? (
                    <span key={j}> </span>
                  ) : (
                    <span
                      key={j}
                      className="hero-word inline-block will-change-transform"
                    >
                      {word}
                    </span>
                  )
                )}
              </span>
            ))}
            {config.heroHighlight && (
              <span className="block overflow-hidden pb-1">
                {config.heroHighlight.split(/(\s+)/).map((word, j) =>
                  /^\s+$/.test(word) ? (
                    <span key={j}> </span>
                  ) : (
                    <span
                      key={j}
                      className="hero-word inline-block accent-underline text-ember-400 will-change-transform"
                    >
                      {word}
                    </span>
                  )
                )}
              </span>
            )}
          </h1>

          <p
            data-hero-sub
            className="mt-6 max-w-xl text-base text-slate-300 md:text-lg"
          >
            {config.heroSubheadline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a data-hero-cta href="#contact" className="btn-ember">
              {config.heroCtaPrimary} <ArrowRight size={16} />
            </a>
            <a data-hero-cta href="#tracking" className="btn-secondary">
              <Radio size={16} /> {config.heroCtaSecondary}
            </a>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-3">
            {[
              ["48", "STATES"],
              ["2.5k+", "FLEET"],
              ["99.8%", "ON-TIME"],
            ].map(([v, l]) => (
              <div
                key={l}
                data-hero-stat
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 backdrop-blur-md"
              >
                <div className="font-display text-lg font-semibold text-cream-50">
                  {v}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[16vh]" />
      </div>
    </section>
  );
}
