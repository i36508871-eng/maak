# Maak — Deploy

Sprint 4B. Frontend on GitHub Pages; the public API is a Cloudflare Worker; the database is Supabase PostgreSQL reached over the Supabase REST (PostgREST) API. The Worker uses pure fetch — no database driver, no nodejs_compat, no Hyperdrive, no filesystem.

## Architecture

    User -> maak PWA (GitHub Pages) -> Cloudflare Worker (maak-api) -> Supabase REST (PostgREST) -> PostgreSQL (providers)

The Worker never opens a TCP socket. It calls the Supabase REST endpoint with the service_role key. This is the simplest production-safe option for Workers and needs no card and no paid plan.

## 1) Supabase (manual, once)

- Create a project at supabase.com.
- In the SQL editor, paste and run worker/db/schema.sql to create the providers table.
- In Project Settings -> API, copy:
  - Project URL                -> SUPABASE_URL
  - service_role secret        -> SUPABASE_SERVICE_ROLE_KEY  (SECRET — never commit)

## 2) Worker secrets (manual)

From worker/:

    npm install
    npx wrangler login       # one-time; free, no card
    npx wrangler secret put SUPABASE_URL
    npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
    npx wrangler secret put ADMIN_TOKEN

MAAK_ALLOW_ORIGIN is a non-secret var already set in worker/wrangler.jsonc (the GitHub Pages origin). Change it if your frontend runs on a different domain.

For local dev, create worker/.dev.vars (gitignored) with the same four keys as plain NAME=VALUE lines, then: npm run dev

## 3) Create the table + seed (idempotent)

The table is created once (Supabase SQL editor, step 1). Seed the 4 providers in EITHER way:

- HTTP (no Node, no filesystem): after deploy, call
    curl -X POST "https://maak-api.<sub>.workers.dev/admin/seed?token=<ADMIN_TOKEN>"
- OR paste worker/db/seed.sql into the Supabase SQL editor.

Both upsert on conflict (id), so they are safe to run repeatedly.

## 4) Deploy the Worker

From worker/:

    npm run deploy

Wrangler prints the public URL, e.g. https://maak-api.<sub>.workers.dev.

Verify:

    curl https://maak-api.<sub>.workers.dev/health
    curl https://maak-api.<sub>.workers.dev/api/providers
    curl https://maak-api.<sub>.workers.dev/api/providers/1

## 5) Point the published frontend at the Worker

The deploy-pages workflow runs npm run build with no secret injection, but Vite auto-loads .env.production during the build. Commit .env.production at the repo root:

    VITE_API_URL=https://maak-api.<sub>.workers.dev

Then push. Pages rebuilds and the frontend calls the Worker.

## 6) End-to-end test

Open https://i36508871-eng.github.io/maak/ — providers appear from the live API.

## Secrets / variables

- SUPABASE_URL               : Worker SECRET (wrangler secret put)
- SUPABASE_SERVICE_ROLE_KEY   : Worker SECRET (wrangler secret put) — bypasses RLS; never commit
- ADMIN_TOKEN                 : Worker SECRET (wrangler secret put) — protects POST /admin/seed
- MAAK_ALLOW_ORIGIN          : Worker VAR (wrangler.jsonc) — CORS origin
- VITE_API_URL               : frontend build-time (.env.production) — public Worker URL, not secret

## Notes

- No DATABASE_URL and no password is ever committed to GitHub. All secrets go through wrangler secret put.
- The Node HTTP server from Sprint 4A is removed; the Cloudflare Worker is the only backend.
- No filesystem use anywhere; init/seed are SQL (Supabase editor) or the HTTP /admin/seed endpoint.
- Nothing in the Frontend / UI changed.
