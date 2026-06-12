import { useRef, useState } from "react";
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  CheckCircle2,
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useSiteConfig, type SocialKey } from "../lib/siteConfig";
import BrandMark from "../components/BrandMark";

type SectionKey =
  | "brand"
  | "hero"
  | "sections"
  | "contact"
  | "footer"
  | "social"
  | "advanced";

const navItems: { id: SectionKey; label: string }[] = [
  { id: "brand", label: "Brand" },
  { id: "hero", label: "Hero" },
  { id: "sections", label: "Section Titles" },
  { id: "contact", label: "Contact Info" },
  { id: "footer", label: "Footer" },
  { id: "social", label: "Social Links" },
  { id: "advanced", label: "Import / Export" },
];

const socialMeta: Record<SocialKey, { label: string; Icon: React.ElementType; placeholder: string }> = {
  twitter: { label: "Twitter / X", Icon: Twitter, placeholder: "https://x.com/yourbrand" },
  linkedin: { label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/company/…" },
  github: { label: "GitHub", Icon: Github, placeholder: "https://github.com/…" },
  facebook: { label: "Facebook", Icon: Facebook, placeholder: "https://facebook.com/…" },
  instagram: { label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/…" },
  youtube: { label: "YouTube", Icon: Youtube, placeholder: "https://youtube.com/@…" },
};

export default function Admin() {
  const { config, update, updateSocial, reset, exportJson, importJson } = useSiteConfig();
  const [active, setActive] = useState<SectionKey>("brand");
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLTextAreaElement>(null);

  const flash = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const handleLogoUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo file must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update({ logoDataUrl: String(reader.result) });
      flash();
    };
    reader.readAsDataURL(file);
  };

  const downloadConfig = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tryImport = () => {
    const text = importRef.current?.value || "";
    if (!text.trim()) return alert("Paste JSON first");
    const ok = importJson(text);
    if (ok) {
      flash();
      if (importRef.current) importRef.current.value = "";
    } else {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 text-cream-50">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <BrandMark size={36} />
            <div>
              <div className="font-display text-base font-semibold text-cream-50">
                Site Admin
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ember-400">
                {config.companyName || "Untitled"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedFlash && (
              <span className="flex items-center gap-1.5 rounded-full bg-mint-500/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-mint-400">
                <CheckCircle2 size={12} /> Saved
              </span>
            )}
            <a href="#/" className="btn-secondary !py-2 !px-4 text-sm">
              <Eye size={14} /> View site
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-12 md:px-8">
        <aside className="md:col-span-3">
          <div className="sticky top-24 space-y-1">
            <div className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Settings
            </div>
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left font-display text-sm transition-all ${
                  active === n.id
                    ? "border-ember-500/50 bg-ember-500/[0.08] text-cream-50"
                    : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/15 hover:bg-white/[0.02] hover:text-cream-50"
                }`}
              >
                {n.label}
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active === n.id ? "bg-ember-400" : "bg-white/10"
                  }`}
                />
              </button>
            ))}
            <button
              onClick={() => {
                if (confirm("Reset all settings to defaults?")) {
                  reset();
                  flash();
                }
              }}
              className="mt-6 flex w-full items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-left font-display text-sm text-red-300 transition-colors hover:bg-red-500/10"
            >
              <RotateCcw size={14} /> Reset to defaults
            </button>
          </div>
        </aside>

        <main className="md:col-span-9">
          {active === "brand" && (
            <Panel title="Brand identity" description="Your logo, company name, and accent color.">
              <Field label="Company name">
                <input
                  className="adm-input"
                  value={config.companyName}
                  onChange={(e) => update({ companyName: e.target.value })}
                />
              </Field>
              <Field label="Short brand mark (shown next to logo)" hint="Usually all caps, e.g. ACME">
                <input
                  className="adm-input"
                  value={config.brandShort}
                  onChange={(e) => update({ brandShort: e.target.value })}
                />
              </Field>
              <Field label="Tagline" hint="Tiny uppercase label below brand mark">
                <input
                  className="adm-input"
                  value={config.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                />
              </Field>

              <Field label="Logo image">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                    {config.logoDataUrl ? (
                      <img src={config.logoDataUrl} alt="logo" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon size={22} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleLogoUpload(f);
                      }}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="btn-secondary !py-2 !px-4 text-sm"
                    >
                      <Upload size={14} /> Upload logo
                    </button>
                    {config.logoDataUrl && (
                      <button
                        onClick={() => update({ logoDataUrl: "" })}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/15"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 font-mono text-[10px] text-slate-400">
                  PNG / SVG / JPG · max 2 MB · square logos look best
                </div>
              </Field>

              <Field label="Primary accent color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => update({ primaryColor: e.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-md border border-white/10 bg-transparent"
                  />
                  <input
                    className="adm-input max-w-[160px]"
                    value={config.primaryColor}
                    onChange={(e) => update({ primaryColor: e.target.value })}
                  />
                </div>
              </Field>
            </Panel>
          )}

          {active === "hero" && (
            <Panel title="Hero section" description="The big headline and CTAs at the top of the page.">
              <Field label="Eyebrow tag" hint="Tiny label shown above the headline">
                <input className="adm-input" value={config.heroEyebrow} onChange={(e) => update({ heroEyebrow: e.target.value })} />
              </Field>
              <Field label="Headline" hint="Use line breaks for stacked lines">
                <textarea className="adm-input min-h-[100px] font-display text-lg" value={config.heroHeadline} onChange={(e) => update({ heroHeadline: e.target.value })} />
              </Field>
              <Field label="Highlighted final line" hint="Rendered with the accent color">
                <input className="adm-input font-display text-lg" value={config.heroHighlight} onChange={(e) => update({ heroHighlight: e.target.value })} />
              </Field>
              <Field label="Subheadline">
                <textarea className="adm-input min-h-[100px]" value={config.heroSubheadline} onChange={(e) => update({ heroSubheadline: e.target.value })} />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Primary button">
                  <input className="adm-input" value={config.heroCtaPrimary} onChange={(e) => update({ heroCtaPrimary: e.target.value })} />
                </Field>
                <Field label="Secondary button">
                  <input className="adm-input" value={config.heroCtaSecondary} onChange={(e) => update({ heroCtaSecondary: e.target.value })} />
                </Field>
              </div>
            </Panel>
          )}

          {active === "sections" && (
            <Panel title="Section titles" description="Each section has a kicker (tiny tag), a title, and an accented highlight.">
              <STE title="Features" k={config.featuresKicker} t={config.featuresTitle} h={config.featuresHighlight}
                onK={(v) => update({ featuresKicker: v })} onT={(v) => update({ featuresTitle: v })} onH={(v) => update({ featuresHighlight: v })} />
              <STE title="Fleet" k={config.fleetKicker} t={config.fleetTitle} h={config.fleetHighlight}
                onK={(v) => update({ fleetKicker: v })} onT={(v) => update({ fleetTitle: v })} onH={(v) => update({ fleetHighlight: v })} />
              <STE title="Technology" k={config.technologyKicker} t={config.technologyTitle} h={config.technologyHighlight}
                onK={(v) => update({ technologyKicker: v })} onT={(v) => update({ technologyTitle: v })} onH={(v) => update({ technologyHighlight: v })} />
              <STE title="Statistics" k={config.statsKicker} t={config.statsTitle} h={config.statsHighlight}
                onK={(v) => update({ statsKicker: v })} onT={(v) => update({ statsTitle: v })} onH={(v) => update({ statsHighlight: v })} />
              <STE title="Services" k={config.servicesKicker} t={config.servicesTitle} h={config.servicesHighlight}
                onK={(v) => update({ servicesKicker: v })} onT={(v) => update({ servicesTitle: v })} onH={(v) => update({ servicesHighlight: v })} />
              <STE title="Testimonials" k={config.testimonialsKicker} t={config.testimonialsTitle} h={config.testimonialsHighlight}
                onK={(v) => update({ testimonialsKicker: v })} onT={(v) => update({ testimonialsTitle: v })} onH={(v) => update({ testimonialsHighlight: v })} />
              <STE title="Contact" k={config.contactKicker} t={config.contactTitle} h={config.contactHighlight}
                onK={(v) => update({ contactKicker: v })} onT={(v) => update({ contactTitle: v })} onH={(v) => update({ contactHighlight: v })} />
            </Panel>
          )}

          {active === "contact" && (
            <Panel title="Contact information" description="Shown in the contact card and footer.">
              <Field label="Email">
                <input className="adm-input" type="email" value={config.email} onChange={(e) => update({ email: e.target.value })} />
              </Field>
              <Field label="Phone">
                <input className="adm-input" type="tel" value={config.phone} onChange={(e) => update({ phone: e.target.value })} />
              </Field>
              <Field label="Address / locations">
                <input className="adm-input" value={config.address} onChange={(e) => update({ address: e.target.value })} />
              </Field>
            </Panel>
          )}

          {active === "footer" && (
            <Panel title="Footer" description="The tagline and legal line at the very bottom.">
              <Field label="Footer tagline">
                <textarea className="adm-input min-h-[110px]" value={config.footerTagline} onChange={(e) => update({ footerTagline: e.target.value })} />
              </Field>
              <Field label="Legal line" hint="DOT / MC numbers, copyright suffix, etc.">
                <input className="adm-input" value={config.legalLine} onChange={(e) => update({ legalLine: e.target.value })} />
              </Field>
            </Panel>
          )}

          {active === "social" && (
            <Panel title="Social media" description="Leave a field blank to hide its icon on the site.">
              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(socialMeta) as SocialKey[]).map((k) => {
                  const meta = socialMeta[k];
                  const Icon = meta.Icon;
                  return (
                    <Field
                      key={k}
                      label={
                        <span className="flex items-center gap-2">
                          <Icon size={14} className="text-ember-400" />
                          {meta.label}
                        </span>
                      }
                    >
                      <input
                        className="adm-input"
                        placeholder={meta.placeholder}
                        value={config.social[k]}
                        onChange={(e) => updateSocial(k, e.target.value)}
                      />
                    </Field>
                  );
                })}
              </div>
            </Panel>
          )}

          {active === "advanced" && (
            <Panel title="Import / Export" description="Move your site config between browsers or back it up.">
              <Field label="Export current config">
                <div className="flex flex-wrap gap-2">
                  <button onClick={downloadConfig} className="btn-ember !py-2 !px-4 text-sm">
                    <Download size={14} /> Download JSON
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(exportJson());
                      flash();
                    }}
                    className="btn-secondary !py-2 !px-4 text-sm"
                  >
                    Copy to clipboard
                  </button>
                </div>
              </Field>
              <Field label="Import config" hint="Paste a previously exported JSON blob">
                <textarea
                  ref={importRef}
                  rows={10}
                  placeholder='{"companyName":"…"}'
                  className="adm-input font-mono text-xs"
                />
                <div className="mt-2 flex justify-end">
                  <button onClick={tryImport} className="btn-ember !py-2 !px-4 text-sm">
                    <Save size={14} /> Apply import
                  </button>
                </div>
              </Field>
            </Panel>
          )}
        </main>
      </div>

      <style>{`
        .adm-input {
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
        .adm-input::placeholder { color: #5a6383; }
        .adm-input:focus {
          border-color: rgba(255,90,31,0.6);
          background: rgba(7,9,20,0.85);
          box-shadow: 0 0 0 4px rgba(255,90,31,0.10);
        }
      `}</style>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card space-y-5 p-6 md:p-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-cream-50">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="space-y-5 border-t border-white/5 pt-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
        {label}
      </div>
      {children}
      {hint && <div className="mt-1.5 text-xs text-slate-400">{hint}</div>}
    </label>
  );
}

function STE({
  title,
  k,
  t,
  h,
  onK,
  onT,
  onH,
}: {
  title: string;
  k: string;
  t: string;
  h: string;
  onK: (v: string) => void;
  onT: (v: string) => void;
  onH: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-base font-semibold text-cream-50">{title}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ember-400">
          Live preview ↓
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Kicker">
          <input className="adm-input" value={k} onChange={(e) => onK(e.target.value)} />
        </Field>
        <Field label="Title">
          <input className="adm-input" value={t} onChange={(e) => onT(e.target.value)} />
        </Field>
        <Field label="Highlight">
          <input className="adm-input" value={h} onChange={(e) => onH(e.target.value)} />
        </Field>
      </div>
      <div className="mt-3 rounded-2xl bg-white/[0.02]/60 p-4">
        <div className="pill">{k || "Kicker"}</div>
        <div className="mt-2 font-display text-xl font-semibold text-cream-50">
          {t} <span className="text-ember-400">{h}</span>
        </div>
      </div>
    </div>
  );
}
