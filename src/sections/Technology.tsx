import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Activity, Zap, BarChart3 } from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

const tabs = [
  { id: "tracking", label: "Live Tracking", icon: Activity },
  { id: "routing", label: "AI Routing", icon: Brain },
  { id: "fleet", label: "Fleet Health", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export default function Technology() {
  const { config } = useSiteConfig();
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("tracking");
  const [tick, setTick] = useState(0);
  const ref = useGsapReveal<HTMLDivElement>();

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="technology" ref={ref} className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.technologyKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.technologyTitle}{" "}
              <span className="text-ember-400">{config.technologyHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-300">
            One operating system unifies dispatch, telematics, ELD, and customer
            visibility — wherever your freight goes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`card-hover flex w-full min-w-[200px] items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                      isActive
                        ? "border-ember-500/60 bg-ember-500/[0.06] shadow-card"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-ember-400" : "text-slate-300"}
                    />
                    <span className="font-display text-sm font-medium text-cream-50">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card relative overflow-hidden lg:col-span-9">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ember-500 via-ember-400 to-ember-500/0" />
            <div className="relative p-6 md:p-8">
              <DashHeader active={active} />
              {active === "tracking" && <LiveTracking tick={tick} />}
              {active === "routing" && <Routing tick={tick} />}
              {active === "fleet" && <FleetHealth tick={tick} />}
              {active === "analytics" && <Analytics tick={tick} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashHeader({ active }: { active: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
        Operating System · {active}
      </div>
      <div className="flex items-center gap-3 font-mono text-[10px] text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-400" />
          LIVE
        </span>
        <span>{new Date().toISOString().slice(0, 19).replace("T", " ")} UTC</span>
      </div>
    </div>
  );
}

function LiveTracking({ tick }: { tick: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <USMap tick={tick} />
        </div>
      </div>
      <div className="space-y-3">
        {[
          { id: "H-9472", route: "SFO → CHI", eta: "12:42 PM", pct: 72 },
          { id: "H-3318", route: "DAL → MIA", eta: "06:08 AM", pct: 41 },
          { id: "H-7720", route: "SEA → NYC", eta: "09:55 PM", pct: 88 },
        ].map((s) => (
          <div key={s.id} className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between">
              <div className="font-display text-sm font-semibold text-cream-50">
                {s.id}
              </div>
              <div className="font-mono text-[10px] text-ember-400">{s.route}</div>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-400"
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-300">
              <span>{s.pct}%</span>
              <span>ETA {s.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Routing({ tick }: { tick: number }) {
  const options = [
    { id: "AI-A", time: "31h 12m", fuel: "$612", savings: "+24%" },
    { id: "AI-B", time: "32h 02m", fuel: "$598", savings: "+19%" },
    { id: "AI-C", time: "33h 41m", fuel: "$571", savings: "+12%" },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-5">
      <div className="md:col-span-3">
        <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <USMap tick={tick} mode="routing" />
        </div>
      </div>
      <div className="space-y-3 md:col-span-2">
        <div className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
            AI Optimization
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-cream-50">
            3 routes computed in 142ms
          </div>
        </div>
        {options.map((o, i) => (
          <div
            key={o.id}
            className={`card-hover rounded-2xl border p-3 ${
              i === 0
                ? "border-ember-500/40 bg-ember-500/[0.06]"
                : "border-white/5 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-display text-sm font-semibold text-cream-50">
                Route {o.id}
              </div>
              <div className="font-mono text-[10px] text-mint-400">{o.savings}</div>
            </div>
            <div className="mt-1 flex gap-4 font-mono text-[10px] text-slate-300">
              <span>{o.time}</span>
              <span>{o.fuel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetHealth({ tick }: { tick: number }) {
  const bars = [78, 92, 64, 88, 71, 95, 81, 69, 87, 90, 76, 83];
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
          Vehicle health score · last 12 hours
        </div>
        <div className="mt-6 flex h-44 items-end gap-2">
          {bars.map((b, i) => (
            <motion.div
              key={i}
              animate={{ height: `${b + ((tick + i) % 5)}%` }}
              transition={{ duration: 1 }}
              className="flex-1 rounded-t-md bg-gradient-to-t from-ember-500 to-ember-400"
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-300">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>Now</span>
        </div>
      </div>
      <div className="space-y-3">
        {[
          ["Active vehicles", "1,842"],
          ["In maintenance", "37"],
          ["Predictive alerts", "12"],
          ["Avg health score", "92.4"],
        ].map(([l, v]) => (
          <div key={l} className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
              {l}
            </div>
            <div className="mt-1 font-display text-xl font-semibold text-cream-50">
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics({ tick }: { tick: number }) {
  const points = Array.from(
    { length: 24 },
    (_, i) => 50 + Math.sin((i + tick) * 0.4) * 18 + Math.cos(i * 0.2) * 8
  );
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 23) * 100} ${100 - p}`)
    .join(" ");

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
          On-time delivery rate · 24h
        </div>
        <svg viewBox="0 0 100 100" className="mt-3 h-44 w-full">
          <defs>
            <linearGradient id="anaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={path + " L 100 100 L 0 100 Z"} fill="url(#anaGrad)" />
          <path d={path} fill="none" stroke="#ff8a4d" strokeWidth="0.6" />
        </svg>
      </div>
      <div className="space-y-3">
        {[
          ["On-time", "99.8%"],
          ["Avg delay", "00:04"],
          ["Loads / day", "2,418"],
          ["NPS", "78"],
        ].map(([l, v]) => (
          <div key={l} className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
              {l}
            </div>
            <div className="mt-1 font-display text-xl font-semibold text-cream-50">
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function USMap({ tick, mode = "tracking" }: { tick: number; mode?: "tracking" | "routing" }) {
  const cities = [
    { name: "SEA", x: 110, y: 70 },
    { name: "SFO", x: 80, y: 160 },
    { name: "LAX", x: 120, y: 220 },
    { name: "DEN", x: 270, y: 175 },
    { name: "DAL", x: 360, y: 270 },
    { name: "CHI", x: 460, y: 150 },
    { name: "ATL", x: 510, y: 260 },
    { name: "MIA", x: 560, y: 330 },
    { name: "NYC", x: 600, y: 145 },
  ];
  const routes: [string, string][] = [
    ["SFO", "CHI"],
    ["DAL", "MIA"],
    ["SEA", "NYC"],
    ["LAX", "ATL"],
    ["DEN", "NYC"],
  ];
  const map = Object.fromEntries(cities.map((c) => [c.name, c]));

  return (
    <svg viewBox="0 0 680 380" className="h-full w-full">
      <defs>
        <linearGradient id="rg" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#ff8a4d" />
        </linearGradient>
        <filter id="mapGlow">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M40,160 C70,90 160,55 230,60 C300,52 360,62 430,70 C500,75 580,95 620,140 C650,180 650,220 610,260 C580,300 520,330 460,340 C380,355 280,360 200,330 C140,310 80,270 50,220 C30,200 30,180 40,160 Z"
        fill="#0c1428"
        stroke="rgba(255,255,255,0.12)"
      />
      {Array.from({ length: 14 * 8 }).map((_, i) => {
        const x = 50 + (i % 14) * 42;
        const y = 70 + Math.floor(i / 14) * 35;
        return <circle key={i} cx={x} cy={y} r="0.8" fill="rgba(255,255,255,0.16)" />;
      })}

      {routes.map(([a, b], i) => {
        const A = map[a];
        const B = map[b];
        const midX = (A.x + B.x) / 2;
        const midY = Math.min(A.y, B.y) - 40 - (i % 2) * 20;
        const d = `M ${A.x} ${A.y} Q ${midX} ${midY} ${B.x} ${B.y}`;
        return (
          <g key={a + b} filter="url(#mapGlow)">
            <path
              d={d}
              fill="none"
              stroke="url(#rg)"
              strokeWidth="1.6"
              strokeDasharray="6 4"
              opacity={mode === "routing" && i > 0 ? 0.3 : 0.9}
              style={{ animation: `dash 4s linear infinite` }}
            />
          </g>
        );
      })}

      {cities.map((c) => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r="4" fill="#ff8a4d" />
          <circle
            cx={c.x}
            cy={c.y}
            r={5 + ((tick + c.x) % 6)}
            fill="none"
            stroke="#ff8a4d"
            strokeWidth="0.6"
            opacity={0.55}
          />
          <text
            x={c.x + 8}
            y={c.y + 3}
            fill="#e3e7f3"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
          >
            {c.name}
          </text>
        </g>
      ))}

      {routes.map(([a, b], i) => {
        const A = map[a];
        const B = map[b];
        const midX = (A.x + B.x) / 2;
        const midY = Math.min(A.y, B.y) - 40 - (i % 2) * 20;
        const t = (tick * 0.18 + i * 0.2) % 1;
        const x = (1 - t) ** 2 * A.x + 2 * (1 - t) * t * midX + t ** 2 * B.x;
        const y = (1 - t) ** 2 * A.y + 2 * (1 - t) * t * midY + t ** 2 * B.y;
        return <circle key={i + "s"} cx={x} cy={y} r="2.8" fill="#e3e7f3" />;
      })}
    </svg>
  );
}
