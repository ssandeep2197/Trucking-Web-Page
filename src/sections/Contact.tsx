import { useState } from "react";
import { Send, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function Contact() {
  const { config } = useSiteConfig();
  const [submitted, setSubmitted] = useState(false);
  const ref = useGsapReveal<HTMLElement>();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <section id="contact" ref={ref} className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.contactKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.contactTitle}{" "}
              <span className="text-ember-400">{config.contactHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-300">
            Tell us about your shipment. A logistics engineer will respond
            within one business hour, 24/7.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={onSubmit} className="card p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full Name" placeholder="Jane Doe" />
                <Field label="Company" placeholder="Acme Logistics" />
                <Field label="Work Email" type="email" placeholder="jane@acme.com" />
                <Field label="Phone" type="tel" placeholder="+1 555 123 4567" />
                <Field label="Origin" placeholder="San Francisco, CA" />
                <Field label="Destination" placeholder="Chicago, IL" />
                <div className="md:col-span-2">
                  <Select
                    label="Service Type"
                    options={[
                      "Full Truckload (FTL)",
                      "Less Than Truckload (LTL)",
                      "Refrigerated",
                      "Expedited",
                      "Heavy Haul",
                      "Dedicated",
                    ]}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Shipment Details
                    </span>
                    <textarea
                      rows={4}
                      placeholder="Pallets, weight, deadline, special handling…"
                      className="dark-input mt-1.5 min-h-[110px]"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  <span className="text-ember-400">256-bit TLS</span> · encrypted in transit
                </div>
                <button type="submit" className="btn-ember">
                  {submitted ? (
                    <>
                      <CheckCircle2 size={16} /> Sent
                    </>
                  ) : (
                    <>
                      Request Quote <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <div className="card p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
                Direct Line
              </div>
              <div className="mt-4 space-y-3">
                <Row icon={<Mail size={14} />} label="Email" value={config.email} />
                <Row icon={<Phone size={14} />} label="24/7 Dispatch" value={config.phone} />
                <Row icon={<MapPin size={14} />} label="HQ" value={config.address} />
              </div>
            </div>

            <div className="card overflow-hidden p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
                Coverage · 48 contiguous states
              </div>
              <div className="mt-3 h-56 w-full">
                <CoverageMap />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-400" /> Active hub
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Partner cross-dock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dark-input {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(7,9,20,0.6);
          padding: 0.7rem 0.95rem;
          font-size: 0.9rem;
          color: #f4f6fc;
          outline: none;
          transition: border-color 120ms, background-color 120ms, box-shadow 120ms;
        }
        .dark-input::placeholder { color: #5a6383; }
        .dark-input:focus {
          border-color: rgba(255,90,31,0.6);
          background: rgba(7,9,20,0.85);
          box-shadow: 0 0 0 4px rgba(255,90,31,0.10);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <input type={type} placeholder={placeholder} className="dark-input mt-1.5" />
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <select defaultValue="" className="dark-input mt-1.5 appearance-none">
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-hover flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember-500/15 text-ember-400 ring-1 ring-ember-500/30">
        {icon}
      </span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
          {label}
        </div>
        <div className="font-display text-sm font-semibold text-cream-50">{value}</div>
      </div>
    </div>
  );
}

function CoverageMap() {
  const hubs: { x: number; y: number; kind: "h" | "p" }[] = [
    { x: 90, y: 80, kind: "h" },
    { x: 150, y: 170, kind: "h" },
    { x: 290, y: 175, kind: "h" },
    { x: 380, y: 250, kind: "h" },
    { x: 470, y: 140, kind: "h" },
    { x: 590, y: 140, kind: "h" },
    { x: 540, y: 290, kind: "h" },
    { x: 200, y: 240, kind: "p" },
    { x: 350, y: 100, kind: "p" },
    { x: 510, y: 215, kind: "p" },
    { x: 250, y: 130, kind: "p" },
  ];
  const routes: [number, number][] = [
    [0, 4],
    [1, 4],
    [2, 4],
    [4, 5],
    [3, 6],
    [2, 3],
    [0, 1],
  ];
  return (
    <svg viewBox="0 0 680 360" className="h-full w-full">
      <defs>
        <linearGradient id="cv" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#5cb0ff" />
        </linearGradient>
      </defs>
      <path
        d="M40,160 C70,90 160,55 230,60 C300,52 360,62 430,70 C500,75 580,95 620,140 C650,180 650,220 610,260 C580,300 520,330 460,340 C380,355 280,360 200,330 C140,310 80,270 50,220 C30,200 30,180 40,160 Z"
        fill="#0c1428"
        stroke="rgba(255,255,255,0.12)"
      />
      {routes.map(([a, b], i) => (
        <line
          key={i}
          x1={hubs[a].x}
          y1={hubs[a].y}
          x2={hubs[b].x}
          y2={hubs[b].y}
          stroke="url(#cv)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.9"
          style={{ animation: "dash 5s linear infinite" }}
        />
      ))}
      {hubs.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r={h.kind === "h" ? 4.5 : 3.5} fill={h.kind === "h" ? "#ff8a4d" : "#5cb0ff"} />
          <circle cx={h.x} cy={h.y} r="9" fill="none" stroke={h.kind === "h" ? "#ff8a4d" : "#5cb0ff"} opacity="0.45">
            <animate attributeName="r" from="4" to="14" dur="2.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2.5s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
