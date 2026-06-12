import { motion } from "framer-motion";
import { Truck, Mountain, ArrowUpRight, Settings } from "lucide-react";

/**
 * Template gallery / home page. Lists every template available and lets
 * the visitor jump into one. New templates can be added by appending to
 * the `templates` array and wiring them up in App + lib/router.
 */

type TemplateCard = {
  id: string;
  title: string;
  tagline: string;
  href: string;
  icon: React.ElementType;
  accent: string;
  preview: React.ReactNode;
};

const templates: TemplateCard[] = [
  {
    id: "logistics",
    title: "Logistics & Trucking",
    tagline:
      "Enterprise freight site with live tracking dashboards, fleet showcase, and AI route optimization.",
    href: "#/logistics",
    icon: Truck,
    accent: "from-ember-500 to-amber-400",
    preview: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(255,138,77,0.4),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-ink-950" />
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-x-0 bottom-0 h-2/3 w-full"
        >
          {/* Road */}
          <rect x="0" y="160" width="400" height="40" fill="#0a0e1a" />
          <line
            x1="0"
            y1="180"
            x2="400"
            y2="180"
            stroke="#ffd166"
            strokeWidth="2"
            strokeDasharray="20 12"
          />
          {/* Stylized truck */}
          <g transform="translate(140, 105)">
            <rect x="0" y="20" width="80" height="40" rx="4" fill="#f1f5fb" />
            <rect x="80" y="30" width="30" height="30" fill="#ff5a1f" />
            <rect x="105" y="32" width="14" height="14" fill="#0a0e1a" />
            <circle cx="22" cy="64" r="8" fill="#0a0e1a" />
            <circle cx="62" cy="64" r="8" fill="#0a0e1a" />
            <circle cx="98" cy="64" r="8" fill="#0a0e1a" />
            <rect x="6" y="28" width="68" height="24" fill="#22e6ff" opacity="0.18" />
          </g>
        </svg>
      </div>
    ),
  },
  {
    id: "crypto",
    title: "Surreal Crypto Journey",
    tagline:
      "Immersive 3D landscape, floating crystals, dreamlike fog. DeFi as a fantasy world to explore.",
    href: "#/crypto",
    icon: Mountain,
    accent: "from-violet-500 to-fuchsia-400",
    preview: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1240] via-[#5c2a5e] to-[#ff6a4d]" />
        {/* Stylized mountain silhouettes */}
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-full w-full"
        >
          <defs>
            <linearGradient id="m1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#33205d" />
              <stop offset="100%" stopColor="#211438" />
            </linearGradient>
            <linearGradient id="m2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5b2e6b" />
              <stop offset="100%" stopColor="#3a1d4d" />
            </linearGradient>
          </defs>
          {/* Sun */}
          <circle cx="280" cy="80" r="28" fill="#ffd9a8" opacity="0.85" />
          <circle cx="280" cy="80" r="46" fill="#ff8a4d" opacity="0.25" />
          {/* Far mountains */}
          <path d="M0,150 L60,90 L120,130 L180,80 L240,120 L300,70 L360,110 L400,90 L400,200 L0,200 Z" fill="url(#m1)" />
          {/* Near mountains */}
          <path d="M0,170 L50,130 L110,160 L170,120 L240,155 L320,110 L400,150 L400,200 L0,200 Z" fill="url(#m2)" />
          {/* Floating crystals */}
          <g fill="#fef0ff" opacity="0.85">
            <polygon points="80,60 92,72 80,84 68,72" />
            <polygon points="200,40 210,52 200,64 190,52" />
            <polygon points="340,55 348,64 340,73 332,64" />
          </g>
        </svg>
      </div>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-cream-50">
      {/* Atmospheric washes */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,138,77,0.10),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(50%_50%_at_75%_25%,rgba(167,139,250,0.10),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.30]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(196,203,225,0.14) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(80% 55% at 50% 45%, black 0%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(80% 55% at 50% 45%, black 0%, transparent 85%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pt-6 md:px-8">
        <a href="#/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 ring-1 ring-ember-500/40">
            <span className="block h-3 w-3 rotate-45 bg-ember-500" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Templates
          </span>
        </a>
        <a
          href="#/admin"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-ember-500/40 hover:text-ember-400"
          aria-label="Admin"
          title="Admin"
        >
          <Settings size={15} />
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-20 md:px-8 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pill-ember"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />
          {templates.length} templates · more shipping soon
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="mt-5 max-w-4xl font-display text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[72px]"
        >
          A collection of{" "}
          <span className="text-ember-400">visual storytelling</span> templates
          built for the modern web.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg"
        >
          Each template is an opinionated take on a different industry — full
          design system, motion, and content patterns ready to fork. Pick one,
          plug your brand in via the admin, ship.
        </motion.p>
      </section>

      {/* Template grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.a
                key={t.id}
                href={t.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.08 }}
                whileHover={{ y: -6 }}
                className="card card-hover group relative block overflow-hidden p-0"
              >
                {/* Preview canvas */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {t.preview}
                  {/* Overlay icon chip */}
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-ink-900/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cream-50 backdrop-blur-md">
                    <Icon size={12} />
                    {t.id}
                  </div>
                </div>
                {/* Meta */}
                <div className="relative space-y-3 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-2xl font-semibold text-cream-50">
                      {t.title}
                    </h2>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all group-hover:border-ember-500/50 group-hover:text-ember-400">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {t.tagline}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-5 py-10 md:px-8">
        <div className="mx-auto max-w-7xl text-center font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
          Template showcase — built for stitching real brands together.
        </div>
      </footer>
    </div>
  );
}
