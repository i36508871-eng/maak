import { useEffect, useState } from "react";
import type { Provider } from "../types";
import { fetchProvider, fetchProviders } from "../services";

type Status = "loading" | "success" | "error";

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchProviders()
      .then((data) => {
        if (!active) return;
        setProviders(data);
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
        setProvider(data);
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
