import Counter from "../components/Counter";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

const stats = [
  { to: 50000, suffix: "+", label: "Deliveries / month" },
  { to: 2500, suffix: "+", label: "Fleet Vehicles" },
  { to: 48, suffix: "", label: "States Covered" },
  { to: 99.8, suffix: "%", label: "On-Time Delivery", decimals: 1 },
];

export default function Stats() {
  const { config } = useSiteConfig();
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <section id="tracking" ref={ref} className="relative w-full overflow-hidden py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900 to-ink-850 p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,138,77,0.18),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-paper-grid opacity-30" />
          <div className="relative mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div data-reveal="block" className="pill-ember">{config.statsKicker}</div>
              <h2 data-reveal="title" className="mt-4 font-display text-3xl font-semibold tracking-tight text-cream-50 md:text-5xl">
                {config.statsTitle}{" "}
                <span className="text-ember-400">{config.statsHighlight}</span>
              </h2>
            </div>
            <p data-reveal="block" className="max-w-md text-slate-300">
              Real-time numbers from the network — refreshed every minute across
              every lane we run.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} data-reveal="card">
                <div className="font-display text-4xl font-semibold text-cream-50 md:text-6xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
                  {s.label}
                </div>
                <div className="mt-3 h-px w-12 bg-gradient-to-r from-ember-400 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
