import {
  Truck,
  Satellite,
  Brain,
  Radar,
  Thermometer,
  Map,
} from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

const features = [
  {
    icon: Truck,
    title: "Fleet Management",
    stat: "2,500+",
    statLabel: "vehicles connected",
    body: "Predictive maintenance, driver scoring, and full lifecycle telemetry across every asset.",
    tone: "ember",
  },
  {
    icon: Satellite,
    title: "Real-Time GPS Tracking",
    stat: "1 sec",
    statLabel: "telemetry refresh",
    body: "Sub-second positional intelligence with geofencing, ETAs, and shipment chain-of-custody.",
    tone: "sky",
  },
  {
    icon: Brain,
    title: "AI Route Optimization",
    stat: "23%",
    statLabel: "fuel saved",
    body: "Neural routing accounts for traffic, weather, HOS, and load priority in real time.",
    tone: "mint",
  },
  {
    icon: Radar,
    title: "Smart Dispatching",
    stat: "<2 min",
    statLabel: "load matching",
    body: "Auto-match drivers to loads using ML, balancing capacity, deadhead, and SLA risk.",
    tone: "violet",
  },
  {
    icon: Thermometer,
    title: "Temperature Monitoring",
    stat: "±0.5°F",
    statLabel: "cold chain accuracy",
    body: "FSMA-compliant continuous monitoring with smart alerts for reefer and pharma freight.",
    tone: "sky",
  },
  {
    icon: Map,
    title: "Nationwide Coverage",
    stat: "48",
    statLabel: "states served",
    body: "Coast-to-coast network of cross-docks, partners, and direct lanes — operating 24/7.",
    tone: "ember",
  },
] as const;

const toneMap: Record<string, { bg: string; fg: string; ring: string }> = {
  ember: { bg: "bg-ember-500/12", fg: "text-ember-400", ring: "ring-ember-500/30" },
  sky: { bg: "bg-sky-500/12", fg: "text-sky-300", ring: "ring-sky-500/30" },
  mint: { bg: "bg-mint-500/12", fg: "text-mint-400", ring: "ring-mint-500/30" },
  violet: { bg: "bg-violet-500/15", fg: "text-violet-300", ring: "ring-violet-500/30" },
};

export default function Features() {
  const { config } = useSiteConfig();
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <section id="services" ref={ref} className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.featuresKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.featuresTitle}{" "}
              <span className="text-ember-500">{config.featuresHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-400">
            Every layer of the platform is engineered for scale, speed, and
            reliability — from the dock door to the data lake.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const tone = toneMap[f.tone];
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                data-reveal="card"
                className="group card card-hover p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${tone.bg} ${tone.fg} ring-1 ${tone.ring}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-semibold text-cream-50">
                      {f.stat}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {f.statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-cream-50">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
