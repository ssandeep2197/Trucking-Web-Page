import {
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import { useSiteConfig, type SocialKey } from "../lib/siteConfig";
import BrandMark from "./BrandMark";

const socialIcons: Record<SocialKey, React.ElementType> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

export default function Footer() {
  const { config } = useSiteConfig();
  const active = (Object.keys(config.social) as SocialKey[]).filter(
    (k) => config.social[k]?.trim()
  );

  return (
    <footer className="relative z-10 border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <a href="#home" className="flex items-center gap-3">
              <BrandMark />
              <div className="leading-none">
                <div className="font-display text-lg font-semibold text-cream-50">
                  {config.brandShort || config.companyName}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember-400">
                  {config.tagline}
                </div>
              </div>
            </a>
            <p className="mt-5 max-w-sm text-sm text-slate-300">{config.footerTagline}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4"
            >
              <input
                type="email"
                placeholder="Subscribe to network updates"
                className="flex-1 bg-transparent text-sm text-cream-50 outline-none placeholder:text-slate-500"
              />
              <button className="grid h-9 w-9 place-items-center rounded-full bg-ember-500 text-white transition-transform hover:scale-105">
                <Send size={14} />
              </button>
            </form>
          </div>

          <div className="grid gap-8 md:col-span-8 md:grid-cols-4">
            <Col title="Services" items={["Full Truckload", "Less Than Truckload", "Expedited", "Refrigerated", "Heavy Haul", "Dedicated"]} />
            <Col title="Platform" items={["Tracking", "Routing AI", "Fleet Health", "Cold Chain", "API", "Status"]} />
            <Col title="Company" items={["About", "Careers", "Press", "Partners", "Contact", "Newsroom"]} />
            <Col title="Legal" items={["Privacy", "Terms", "DOT Notice", "Insurance", "Compliance"]} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 md:flex-row md:items-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
            © {new Date().getFullYear()} {config.companyName} · {config.legalLine}
          </div>
          <div className="flex items-center gap-2">
            {active.length === 0 ? (
              <a
                href="#/admin"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-ember-400"
              >
                Add social links →
              </a>
            ) : (
              active.map((k) => {
                const Icon = socialIcons[k];
                return (
                  <a
                    key={k}
                    href={config.social[k]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={k}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:border-ember-500/40 hover:text-ember-400"
                  >
                    <Icon size={14} />
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
        {title}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="text-sm text-slate-400 transition-colors hover:text-cream-50">
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
