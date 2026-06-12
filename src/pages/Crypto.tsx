import { lazy, Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ErrorBoundary from "../components/ErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

const CryptoScene = lazy(() => import("../three/crypto/CryptoScene"));

/**
 * Surreal crypto-as-journey template. A continuous 3D landscape lives
 * behind the entire page; scrolling pushes the camera deeper into the
 * world while big poetic typography scrolls past in chapters.
 */
export default function Crypto() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      // Drive the scene's scroll progress from window scroll across the page
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });

      // Per-chapter reveal animations
      root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el) => {
        const words = el.querySelectorAll(".chapter-word");
        const sub = el.querySelector("[data-sub]");
        gsap.from(words, {
          y: 120,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            once: true,
          },
        });
        if (sub) {
          gsap.from(sub, {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              once: true,
            },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#1a0b2e] text-cream-50"
    >
      {/* Sticky 3D scene — fills viewport, lives behind every chapter */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ErrorBoundary
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#5c2a5e] to-[#ff6a4d]" />
          }
        >
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] via-[#5c2a5e] to-[#ff6a4d]" />
            }
          >
            <CryptoScene scrollProgressRef={scrollProgressRef} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Top-left back-to-templates link */}
      <a
        href="#/"
        className="fixed left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-cream-50 backdrop-blur-md transition-all hover:border-white/30 sm:text-[10px] md:left-8 md:top-8"
      >
        <ArrowLeft size={12} /> Templates
      </a>

      {/* === CHAPTER 1 — opening === */}
      <section className="relative z-10 flex min-h-[100svh] items-center px-4 sm:px-6 md:px-10">
        <div data-chapter className="max-w-5xl">
          <div className="pill-ember" data-sub>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
            A surreal interactive landscape
          </div>
          <h1 className="mt-6 font-display text-[36px] font-semibold leading-[0.95] tracking-tight sm:text-[48px] md:text-[96px] lg:text-[120px]">
            <span className="block overflow-hidden pb-2">
              {"DeFi".split("").map((c, i) => (
                <span key={i} className="chapter-word inline-block will-change-transform">
                  {c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2">
              {"is a".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block will-change-transform"
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2">
              {"landscape".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block bg-gradient-to-br from-ember-300 via-pink-400 to-violet-400 bg-clip-text text-transparent will-change-transform"
                >
                  {c}
                </span>
              ))}
            </span>
          </h1>
          <p
            data-sub
            className="mt-6 max-w-2xl text-sm text-cream-100/85 sm:text-base md:mt-8 md:text-lg"
          >
            Not a dashboard. Not a chart. A world you walk through. Scroll to
            travel deeper.
          </p>
        </div>
      </section>

      {/* === CHAPTER 2 — exploration === */}
      <section className="relative z-10 flex min-h-[100svh] items-center justify-end px-4 sm:px-6 md:px-10">
        <div data-chapter className="max-w-3xl text-right">
          <div className="pill-ember ml-auto" data-sub>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
            Chapter II — explore
          </div>
          <h2 className="mt-6 font-display text-[32px] font-semibold leading-[1.0] tracking-tight sm:text-[44px] md:text-[72px] lg:text-[88px]">
            <span className="block overflow-hidden pb-1">
              {"Borderless".split("").map((c, i) => (
                <span key={i} className="chapter-word inline-block will-change-transform">
                  {c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-1">
              {"by design.".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block bg-gradient-to-br from-fuchsia-300 to-amber-300 bg-clip-text text-transparent will-change-transform"
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          </h2>
          <p data-sub className="mt-6 ml-auto max-w-xl text-sm text-cream-100/85 sm:text-base md:mt-8 md:text-lg">
            Liquidity flows between mountains the way rivers do — invisible
            until you watch them long enough.
          </p>
        </div>
      </section>

      {/* === CHAPTER 3 — depth === */}
      <section className="relative z-10 flex min-h-[100svh] items-center px-4 sm:px-6 md:px-10">
        <div data-chapter className="max-w-4xl">
          <div className="pill-ember" data-sub>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
            Chapter III — ascend
          </div>
          <h2 className="mt-6 font-display text-[32px] font-semibold leading-[1.0] tracking-tight sm:text-[44px] md:text-[78px] lg:text-[96px]">
            <span className="block overflow-hidden pb-1">
              {"Every".split("").map((c, i) => (
                <span key={i} className="chapter-word inline-block will-change-transform">
                  {c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-1">
              {"peak is".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block will-change-transform"
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-1">
              {"a protocol.".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block bg-gradient-to-br from-amber-200 via-rose-300 to-violet-400 bg-clip-text text-transparent will-change-transform"
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          </h2>
          <p data-sub className="mt-6 max-w-2xl text-sm text-cream-100/85 sm:text-base md:mt-8 md:text-lg">
            Floating crystals are positions. Sunlight on the ridge is yield.
            What you see is what you own.
          </p>
        </div>
      </section>

      {/* === CHAPTER 4 — CTA === */}
      <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 sm:px-6 md:px-10">
        <div data-chapter className="max-w-4xl text-center">
          <h2 className="font-display text-[32px] font-semibold leading-[1.0] tracking-tight sm:text-[44px] md:text-[80px] lg:text-[104px]">
            <span className="block overflow-hidden pb-1">
              {"Begin the".split("").map((c, i) => (
                <span key={i} className="chapter-word inline-block will-change-transform">
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-1">
              {"journey.".split("").map((c, i) => (
                <span
                  key={i}
                  className="chapter-word inline-block bg-gradient-to-br from-ember-300 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent will-change-transform"
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          </h2>
          <p
            data-sub
            className="mx-auto mt-6 max-w-xl text-sm text-cream-100/85 sm:text-base md:text-lg"
          >
            No tickers. No charts. Just a portal — and a horizon you've never
            seen before.
          </p>
          <div data-sub className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
            <a
              href="#/"
              className="inline-flex items-center gap-2 rounded-full bg-cream-50 px-6 py-3 font-display text-sm font-semibold text-ink-950 transition-all hover:-translate-y-0.5"
            >
              Enter the world <ArrowRight size={16} />
            </a>
            <a
              href="#/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 font-display text-sm font-semibold text-cream-50 transition-all hover:border-white/30"
            >
              Other templates
            </a>
          </div>
        </div>
      </section>

      {/* Bottom fade so chapter 4 doesn't crash into the abrupt end */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-5 h-24 bg-gradient-to-t from-[#1a0b2e] to-transparent" />
    </div>
  );
}
