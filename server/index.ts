import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { findProvider, getDb, insertProvider, listProviders } from "./db";
import { seedProviders } from "./data/seed-providers";

const PORT = Number(process.env.MAAK_PORT ?? 8787);
const ALLOW_ORIGIN = process.env.MAAK_ALLOW_ORIGIN || "*";

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

function handle(req: IncomingMessage, res: ServerResponse): void {
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
    send(res, 200, listProviders());
    return;
  }

  if (parts[0] === "api" && parts[1] === "providers" && parts.length === 3) {
    const id = Number(parts[2]);
    if (!Number.isInteger(id) || id <= 0) {
      send(res, 400, { error: "invalid id" });
      return;
    }
    const provider = findProvider(id);
    if (!provider) {
      send(res, 404, { error: "not found" });
      return;
    }
    send(res, 200, provider);
    return;
  }

  send(res, 404, { error: "not found" });
}

const server = createServer(handle);

server.listen(PORT, () => {
  const db = getDb();
  if (listProviders().length === 0) {
    const seed = db.transaction(() => {
      for (const provider of seedProviders) insertProvider(provider);
    });
    seed();
    console.log("Auto-seeded " + seedProviders.length + " providers");
  }
  console.log("maak API listening on http://localhost:" + PORT);
});
