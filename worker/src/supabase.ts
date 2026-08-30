import type { Env, Provider } from "./types";

function headers(env: Env, extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY,
    Accept: "application/json",
    ...extra,
  };
}

// GET /rest/v1/providers?order=id.asc -> Provider[]
export async function listProviders(env: Env): Promise<Provider[]> {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/providers?order=id.asc", {
    headers: headers(env),
  });
  if (!res.ok) {
    throw new Error("supabase list failed: " + res.status + " " + (await res.text()));
  }
  return (await res.json()) as Provider[];
}

// GET /rest/v1/providers?id=eq.<id> -> Provider | null
export async function findProvider(env: Env, id: number): Promise<Provider | null> {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/providers?id=eq." + id, {
    headers: headers(env),
  });
  if (!res.ok) {
    throw new Error("supabase get failed: " + res.status);
  }
  const arr = (await res.json()) as Provider[];
  return arr.length > 0 ? arr[0] : null;
}

// POST /rest/v1/providers with Prefer: resolution=merge-duplicates (idempotent upsert).
export async function upsertProviders(env: Env, providers: Provider[]): Promise<void> {
  const res = await fetch(env.SUPABASE_URL + "/rest/v1/providers", {
    method: "POST",
    headers: headers(env, {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    }),
    body: JSON.stringify(providers),
  });
  if (!res.ok) {
    throw new Error("supabase seed failed: " + res.status + " " + (await res.text()));
  }
}
