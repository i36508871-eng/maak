import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { findProvider, initDb, insertProvider, listProviders } from "./db";
import { seedProviders } from "./data/seed-providers";

const PORT = Number(process.env.PORT ?? process.env.MAAK_PORT ?? 8787);
// Default to the published frontend origin. Override with MAAK_ALLOW_ORIGIN on other hosts.
const ALLOW_ORIGIN = process.env.MAAK_ALLOW_ORIGIN || "https://i36508871-eng.github.io";

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    send(res, 405, { error: "method not allowed" });
    return;
  }

  const url = new URL(req.url ?? "/", "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);

  if (url.pathname === "/health") {
    send(res, 200, { ok: true });
    return;
  }

  if (parts[0] === "api" && parts[1] === "providers" && parts.length === 2) {
    try {
      send(res, 200, await listProviders());
    } catch (e) {
      send(res, 503, { error: "database error", detail: String(e) });
    }
    return;
  }

  if (parts[0] === "api" && parts[1] === "providers" && parts.length === 3) {
    const id = Number(parts[2]);
    if (!Number.isInteger(id) || id <= 0) {
      send(res, 400, { error: "invalid id" });
      return;
    }
    try {
      const provider = await findProvider(id);
      if (!provider) {
        send(res, 404, { error: "not found" });
        return;
      }
      send(res, 200, provider);
    } catch (e) {
      send(res, 503, { error: "database error", detail: String(e) });
    }
    return;
  }

  send(res, 404, { error: "not found" });
}

const server = createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!res.headersSent) send(res, 500, { error: "internal error" });
    console.error(e);
  });
});

server.listen(PORT, async () => {
  try {
    await initDb();
    if ((await listProviders()).length === 0) {
      await Promise.all(seedProviders.map((p) => insertProvider(p)));
      console.log("Auto-seeded " + seedProviders.length + " providers");
    }
    console.log("maak API listening on 0.0.0.0:" + PORT);
  } catch (e) {
    console.error("Startup DB init failed:", e);
  }
});
