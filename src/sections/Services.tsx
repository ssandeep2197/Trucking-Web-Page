import {
  Boxes,
  PackageOpen,
  Zap,
  Snowflake,
  Wrench,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";
import { useGsapReveal } from "../hooks/useGsapReveal";

const services = [
  {
    icon: Boxes,
    title: "Full Truckload (FTL)",
    body: "Dedicated trailers, direct lanes, single-driver delivery. Ideal for time-sensitive, high-volume shipments.",
  },
  {
    icon: PackageOpen,
    title: "Less Than Truckload (LTL)",
    body: "Shared capacity across cross-dock network. Smart consolidation reduces cost without sacrificing speed.",
  },
  {
    icon: Zap,
    title: "Expedited Shipping",
    body: "Team drivers, white-glove handling, and prioritized dispatch for mission-critical freight.",
  },
  {
    icon: Snowflake,
    title: "Refrigerated Freight",
    body: "FSMA-compliant cold chain with continuous temperature logging from origin to delivery.",
  },
  {
    icon: Wrench,
    title: "Heavy Equipment Transport",
    body: "Multi-axle, permitted moves for industrial, construction, and energy sector clients.",
  },
  {
    icon: Building2,
    title: "Dedicated Logistics Solutions",
    body: "Enterprise contracts with custom SLAs, dedicated fleets, and embedded operations.",
  },
];

export default function Services() {
  const { config } = useSiteConfig();
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <section id="about" ref={ref} className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="block" className="pill mb-4">{config.servicesKicker}</div>
            <h2 data-reveal="title" className="section-title">
              {config.servicesTitle}{" "}
              <span className="text-ember-400">{config.servicesHighlight}</span>
            </h2>
          </div>
          <p data-reveal="block" className="max-w-md text-slate-400">
            From a single pallet to a thousand-mile heavy-haul, we build the
            right service around your supply chain.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.title}
                href="#contact"
                data-reveal="card"
                className="group card card-hover p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ember-500/120/12 text-ember-400 ring-1 ring-ember-500/30">
                    <Icon size={20} />
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all group-hover:border-ember-500/40 group-hover:text-ember-400">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-cream-50">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.body}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
