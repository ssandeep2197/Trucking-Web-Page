import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

const testimonials = [
  {
    quote:
      "They rebuilt our cross-country lanes from scratch. We cut transit time by 18% and never missed a window in Q3.",
    author: "Morgan Chen",
    role: "VP Supply Chain, NorthArc Industrial",
    rating: 5,
  },
  {
    quote:
      "Real-time visibility is unmatched. Our customers literally see our trucks roll into their docks live.",
    author: "Priya Ramaswamy",
    role: "Director Logistics, Helio Foods",
    rating: 5,
  },
  {
    quote:
      "Cold chain integrity at 99.97% over 14,000 deliveries. The platform paid for itself in one quarter.",
    author: "Daniel Ortega",
    role: "Head of Operations, VitaPharma",
    rating: 5,
  },
  {
    quote:
      "We moved 12 heavy-haul rigs across three permit states in five days. Nobody else even quoted it.",
    author: "Anita Brooks",
    role: "Director, Western Grid Power",
    rating: 5,
  },
  {
    quote:
      "Their API made integration painless. ETAs flow into our WMS in under a second.",
    author: "Tomás Becker",
    role: "Engineering Lead, Cargo.io",
    rating: 5,
  },
];

const logos = ["NORTHARC", "HELIO", "VITAPHARMA", "WESTERN GRID", "CARGO.IO", "AURORA", "BLUE LINE", "QUANTA"];

export default function Testimonials() {
  const { config } = useSiteConfig();
  const looped = [...testimonials, ...testimonials];
  const ref = useGsapReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-ink-900 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.testimonialsKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.testimonialsTitle}{" "}
              <span className="text-ember-400">{config.testimonialsHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-300">
            Average client tenure: 4.7 years. Net promoter score: 78.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
          <div className="marquee-track">
            {looped.map((t, i) => (
              <div
                key={i}
                className="card card-hover mx-3 w-[360px] shrink-0 p-6 md:w-[420px]"
              >
                <Quote size={22} className="text-ember-400" />
                <p className="mt-3 text-sm leading-relaxed text-cream-100">
                  "{t.quote}"
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <div className="font-display text-sm font-semibold text-cream-50">
                      {t.author}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {t.role}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={12} className="fill-ember-400 text-ember-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 grid grid-cols-2 items-center gap-x-8 gap-y-6 border-t border-white/5 pt-10 md:grid-cols-4 lg:grid-cols-8"
        >
          {logos.map((l) => (
            <div
              key={l}
              className="text-center font-mono text-xs tracking-[0.25em] text-slate-300 transition-colors hover:text-cream-50"
            >
              {l}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
