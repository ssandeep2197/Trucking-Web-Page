import { useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import {
  Snowflake,
  Package,
  Layers,
  Mountain,
  Check,
} from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import SvgTruck from "../components/SvgTruck";
import { useGsapReveal } from "../hooks/useGsapReveal";

const trucks = [
  {
    id: "dryvan",
    label: "Dry Van",
    icon: Package,
    capacity: "53 ft · 45,000 lb",
    use: "General freight, palletized cargo, retail distribution.",
    metrics: ["Sealed cargo", "All-weather", "Drop & hook ready"],
  },
  {
    id: "reefer",
    label: "Refrigerated",
    icon: Snowflake,
    capacity: "53 ft · -20°F → 75°F",
    use: "Cold chain, pharmaceuticals, fresh produce, dairy.",
    metrics: ["FSMA compliant", "Continuous temp log", "Multi-zone"],
  },
  {
    id: "flatbed",
    label: "Flatbed",
    icon: Layers,
    capacity: "48 ft · 48,000 lb",
    use: "Construction, machinery, steel, oversized cargo.",
    metrics: ["Open deck", "Tarp ready", "Side-load access"],
  },
  {
    id: "heavyhaul",
    label: "Heavy Haul",
    icon: Mountain,
    capacity: "Up to 200,000 lb",
    use: "Industrial equipment, energy, defense, permit loads.",
    metrics: ["Multi-axle", "Permit logistics", "Pilot car coord."],
  },
] as const;

export default function Fleet() {
  const { config } = useSiteConfig();
  const [active, setActive] = useState<(typeof trucks)[number]["id"]>("dryvan");
  const current = trucks.find((t) => t.id === active)!;
  const wheelRotate = useMotionValue(0);
  const ref = useGsapReveal<HTMLDivElement>();

  return (
    <section id="fleet" ref={ref} className="relative w-full overflow-hidden bg-ink-900 py-24 md:py-32">
      <div className="absolute inset-0 bg-paper-grid opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.fleetKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.fleetTitle}{" "}
              <span className="text-ember-400">{config.fleetHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-300">
            Click, compare, choose. The right trailer for every load — fully
            owned and managed by us.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-row gap-3 overflow-x-auto pb-1 lg:col-span-3 lg:flex-col lg:overflow-visible">
            {trucks.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`card-hover group flex w-full min-w-[200px] items-center gap-3 rounded-2xl border p-4 text-left ${
                    isActive
                      ? "border-ember-500/60 bg-ember-500/[0.06] shadow-card"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      isActive
                        ? "bg-ember-500/20 text-ember-400 ring-1 ring-ember-500/40"
                        : "bg-white/[0.02]/5 text-slate-300"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="font-display text-base font-semibold text-cream-50">
                      {t.label}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {t.capacity}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="card relative overflow-hidden lg:col-span-6">
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,_rgba(255,138,77,0.18)_0%,_transparent_60%)]" />
            <div className="relative flex h-[360px] flex-col items-center justify-center px-6 md:h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xl"
                >
                  <SvgTruck wheelRotate={wheelRotate} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="card card-hover p-6"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
                  Class · {current.id.toUpperCase()}
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-cream-50">
                  {current.label}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{current.use}</p>
                <ul className="mt-5 space-y-2">
                  {current.metrics.map((m) => (
                    <li
                      key={m}
                      className="flex items-center gap-2 text-sm text-cream-100"
                    >
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-mint-500/20 text-mint-400">
                        <Check size={10} />
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="btn-secondary mt-6 w-full justify-center !py-2 text-sm"
                >
                  Request this class
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
