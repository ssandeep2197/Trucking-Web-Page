import { useEffect, useState } from "react";

export type Route = "home" | "logistics" | "crypto" | "admin";

/** Map a hash like "#/logistics" or "#/admin/brand" to a Route. */
export function parseHash(hash: string): Route {
  const cleaned = hash.replace(/^#\/?/, "").trim().toLowerCase();
  if (!cleaned) return "home";
  if (cleaned.startsWith("admin")) return "admin";
  if (cleaned.startsWith("logistics")) return "logistics";
  if (cleaned.startsWith("crypto")) return "crypto";
  return "home";
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? "home" : parseHash(window.location.hash)
  );
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

/** Convenience for buttons/links — navigate programmatically. */
export function navigate(path: string) {
  window.location.hash = path.startsWith("#") ? path : `#${path}`;
}
