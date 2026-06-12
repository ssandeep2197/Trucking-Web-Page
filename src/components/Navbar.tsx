import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, Settings } from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import BrandMark from "./BrandMark";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Fleet", href: "#fleet" },
  { label: "Technology", href: "#technology" },
  { label: "Tracking", href: "#tracking" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { config } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 mx-auto h-24 max-w-5xl transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(255,138,77,0.28), transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      <div
        className={`relative mx-3 mt-3 rounded-2xl border transition-all duration-300 md:mx-auto md:mt-4 md:max-w-7xl ${
          scrolled
            ? "border-ember-500/25 bg-ink-900/80 backdrop-blur-xl"
            : "border-white/5 bg-ink-900/30 backdrop-blur"
        }`}
        style={
          scrolled
            ? {
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,138,77,0.18), 0 1px 0 0 rgba(255,255,255,0.05), 0 12px 40px -10px rgba(255,90,31,0.45), 0 0 0 1px rgba(255,138,77,0.08)",
              }
            : undefined
        }
      >
        <nav className="flex items-center justify-between gap-6 px-4 py-2.5 md:px-5">
          <a href="#home" className="flex items-center gap-3">
            <BrandMark size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-tight text-cream-50">
                {config.brandShort || config.companyName}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember-400">
                {config.tagline}
              </span>
            </div>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-1.5 font-display text-sm text-slate-300 transition-colors hover:text-cream-50"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#/admin"
              title="Admin"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-ember-500/40 hover:text-ember-400"
            >
              <Settings size={15} />
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-cream-50 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <motion.div
          className={`h-px origin-left rounded-full bg-gradient-to-r from-ember-500 to-ember-400 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_0_12px_rgba(255,138,77,0.7)]" : ""
          }`}
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 lg:hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-card backdrop-blur-xl">
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 font-display text-cream-50 hover:bg-white/[0.05]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#/admin"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 font-display text-ember-400 hover:bg-white/[0.05]"
                  >
                    Admin
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
