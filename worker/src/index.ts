import type { Env } from "./types";
import { findProvider, listProviders, upsertProviders } from "./supabase";
import { seedProviders } from "./seed-data";

function cors(env: Env): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": env.MAAK_ALLOW_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
    "Access-Control-Max-Age": "86400",
  };
}

function json(env: Env, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(env) },
  });
}

export default {
  async fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    if (url.pathname === "/health") {
      return json(env, 200, { ok: true });
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts[0] === "api" && parts[1] === "providers" && parts.length === 2 && req.method === "GET") {
      try {
        return json(env, 200, await listProviders(env));
      } catch (e) {
        return json(env, 503, { error: "database error", detail: String(e) });
      }
    }

    if (parts[0] === "api" && parts[1] === "providers" && parts.length === 3 && req.method === "GET") {
      const id = Number(parts[2]);
      if (!Number.isInteger(id) || id <= 0) {
        return json(env, 400, { error: "invalid id" });
      }
      try {
        const provider = await findProvider(env, id);
        if (!provider) return json(env, 404, { error: "not found" });
        return json(env, 200, provider);
      } catch (e) {
        return json(env, 503, { error: "database error", detail: String(e) });
      }
    }

    if (parts[0] === "admin" && parts[1] === "seed" && req.method === "POST") {
      const token = url.searchParams.get("token") || req.headers.get("X-Admin-Token") || "";
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return json(env, 401, { error: "unauthorized" });
      }
      try {
        await upsertProviders(env, seedProviders);
        return json(env, 200, { ok: true, seeded: seedProviders.length });
      } catch (e) {
        return json(env, 503, { error: "seed failed", detail: String(e) });
      }
    }

    return json(env, 404, { error: "not found" });
  },
};
