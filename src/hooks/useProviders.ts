import { useEffect, useState } from "react";
import type { Provider } from "../types";
import { fetchProvider, fetchProviders } from "../services";

type Status = "loading" | "success" | "error";

// In production, seed/demo listings can be hidden entirely. Flip
// VITE_INCLUDE_SEED to "false" to keep only real, published providers visible.
const INCLUDE_SEED: boolean = (import.meta.env.VITE_INCLUDE_SEED as string | undefined) !== "false";

// A provider is visible in the marketplace when:
//  • real: published (published_at set) — unpublished real listings are hidden.
//  • seed: only when seed display is enabled (off in production).
function isListed(p: Provider): boolean {
  if (p.listing_kind === "real") return p.published_at != null;
  if (p.listing_kind === "seed") return INCLUDE_SEED;
  return INCLUDE_SEED;
}

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchProviders()
      .then((data) => {
        if (!active) return;
        setProviders(data.filter(isListed));
        setStatus("success");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return { providers, status };
}

export function useProvider(id: number) {
  const [provider, setProvider] = useState<Provider | undefined>(undefined);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchProvider(id)
      .then((data) => {
        if (!active) return;
        setProvider(data && isListed(data) ? data : undefined);
        setStatus("success");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { provider, status };
}
