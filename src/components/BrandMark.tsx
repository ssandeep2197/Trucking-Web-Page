import { Truck } from "lucide-react";
import { useSiteConfig } from "../lib/siteConfig";

export default function BrandMark({ size = 40 }: { size?: number }) {
  const { config } = useSiteConfig();
  if (config.logoDataUrl) {
    return (
      <span
        className="relative grid place-items-center overflow-hidden rounded-xl ring-1 ring-white/10"
        style={{ width: size, height: size }}
      >
        <img
          src={config.logoDataUrl}
          alt={`${config.companyName} logo`}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }
  return (
    <span
      className="relative grid place-items-center rounded-xl bg-ember-500 text-white shadow-card"
      style={{ width: size, height: size }}
    >
      <Truck size={Math.round(size * 0.5)} />
    </span>
  );
}
