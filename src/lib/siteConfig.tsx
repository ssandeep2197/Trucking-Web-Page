import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SocialKey = "twitter" | "linkedin" | "github" | "facebook" | "instagram" | "youtube";

export type SiteConfig = {
  // Brand
  companyName: string;
  brandShort: string; // e.g. shown next to logo icon
  tagline: string; // small uppercase label under brand
  logoDataUrl: string; // base64 data url; empty = use built-in icon
  primaryColor: string; // hex — accent color
  // Hero
  heroEyebrow: string;
  heroHeadline: string; // can contain \n line breaks
  heroHighlight: string; // gradient-highlighted final word/phrase
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  // Section titles
  featuresTitle: string;
  featuresHighlight: string;
  featuresKicker: string;
  fleetTitle: string;
  fleetHighlight: string;
  fleetKicker: string;
  technologyTitle: string;
  technologyHighlight: string;
  technologyKicker: string;
  statsTitle: string;
  statsHighlight: string;
  statsKicker: string;
  servicesTitle: string;
  servicesHighlight: string;
  servicesKicker: string;
  testimonialsTitle: string;
  testimonialsHighlight: string;
  testimonialsKicker: string;
  contactTitle: string;
  contactHighlight: string;
  contactKicker: string;
  // Contact
  email: string;
  phone: string;
  address: string;
  // Footer
  footerTagline: string;
  legalLine: string;
  // Social
  social: Record<SocialKey, string>;
};

export const DEFAULT_CONFIG: SiteConfig = {
  companyName: "Your Company",
  brandShort: "BRAND",
  tagline: "Transportation",
  logoDataUrl: "",
  primaryColor: "#22e6ff",

  heroEyebrow: "Live across 48 states",
  heroHeadline: "Every load.\nTracked live.\nDelivered",
  heroHighlight: "on time.",
  heroSubheadline:
    "AI dispatch, real-time GPS, and a coast-to-coast fleet — one platform built so your supply chain runs without surprises.",
  heroCtaPrimary: "Get Freight Quote",
  heroCtaSecondary: "Track Shipment",

  featuresKicker: "Capabilities",
  featuresTitle: "Built for the modern",
  featuresHighlight: "supply chain",

  fleetKicker: "The Fleet",
  fleetTitle: "Inspect every truck in",
  fleetHighlight: "3D",

  technologyKicker: "The Platform",
  technologyTitle: "The command center for",
  technologyHighlight: "every load",

  statsKicker: "Network",
  statsTitle: "Trusted by operators",
  statsHighlight: "at scale",

  servicesKicker: "Services",
  servicesTitle: "Every freight need,",
  servicesHighlight: "covered",

  testimonialsKicker: "Voices",
  testimonialsTitle: "Operators choose us",
  testimonialsHighlight: "on repeat",

  contactKicker: "Get In Touch",
  contactTitle: "Move with",
  contactHighlight: "us",

  email: "dispatch@yourcompany.com",
  phone: "+1 (800) 555-0188",
  address: "Sacramento, CA · Chicago, IL",

  footerTagline:
    "The operating system for American freight. AI-powered logistics, real-time visibility, and nationwide coverage — engineered for the next decade of supply chain.",
  legalLine: "DOT 0000000 · MC 0000000 · All rights reserved",

  social: {
    twitter: "",
    linkedin: "",
    github: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

const STORAGE_KEY = "site_config_v1";

function loadConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      social: { ...DEFAULT_CONFIG.social, ...(parsed.social || {}) },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveConfig(cfg: SiteConfig) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // ignore quota errors
  }
}

type Ctx = {
  config: SiteConfig;
  update: (patch: Partial<SiteConfig>) => void;
  updateSocial: (key: SocialKey, value: string) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
};

const SiteConfigContext = createContext<Ctx | null>(null);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig());

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig({
            ...DEFAULT_CONFIG,
            ...parsed,
            social: { ...DEFAULT_CONFIG.social, ...(parsed.social || {}) },
          });
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Apply primary color to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", config.primaryColor);
  }, [config.primaryColor]);

  const value = useMemo<Ctx>(
    () => ({
      config,
      update: (patch) => setConfig((c) => ({ ...c, ...patch })),
      updateSocial: (key, val) =>
        setConfig((c) => ({ ...c, social: { ...c.social, [key]: val } })),
      reset: () => setConfig(DEFAULT_CONFIG),
      exportJson: () => JSON.stringify(config, null, 2),
      importJson: (json) => {
        try {
          const parsed = JSON.parse(json);
          setConfig({
            ...DEFAULT_CONFIG,
            ...parsed,
            social: { ...DEFAULT_CONFIG.social, ...(parsed.social || {}) },
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    [config]
  );

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error("useSiteConfig must be used inside SiteConfigProvider");
  return ctx;
}
