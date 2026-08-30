# maak Worker

Cloudflare Worker (public API). Reads providers from Supabase PostgreSQL via the Supabase REST (PostgREST) API using pure fetch — no DB driver, no nodejs_compat, no Hyperdrive, no filesystem.

## Cloudflare deploy (production)

The wrangler config lives at the REPO ROOT (`wrangler.jsonc`, name `maak`, main `worker/src/index.ts`). Cloudflare's Git-based Workers Build looks for wrangler.jsonc at the repo root, so this is what makes the deploy a real fetch-handler Worker with a *.workers.dev URL (without it, Cloudflare falls back to the frontend Vite build and deploys Static Assets — no Worker URL, no /health).

From the repo root:

    npx wrangler deploy                 # uses root wrangler.jsonc -> Worker "maak"

Cloudflare dashboard (Workers Build) settings:
- Root directory: (empty / repo root)
- Build command:  npm install          # optional; worker has no runtime npm deps
- Deploy command: npx wrangler deploy

## Endpoints
- GET  /health
- GET  /api/providers
- GET  /api/providers/:id
- POST /admin/seed?token=<ADMIN_TOKEN>   (idempotent upsert of the 4 providers)

## Local dev

From worker/:

    npm install                          # wrangler + workers-types + typescript
    npm run dev                          # wrangler dev --config ../wrangler.jsonc

Put local secrets in `../.dev.vars` (repo root, gitignored) as NAME=VALUE lines:
    SUPABASE_URL=...
    SUPABASE_SERVICE_ROLE_KEY=...
    ADMIN_TOKEN=...
    MAAK_ALLOW_ORIGIN=https://i36508871-eng.github.io

## DB init / seed (idempotent, no filesystem)
- Create the table once: paste `worker/db/schema.sql` into the Supabase SQL editor.
- Seed: `curl -X POST "https://maak.<sub>.workers.dev/admin/seed?token=<ADMIN_TOKEN>"`
  (or paste `worker/db/seed.sql` into the Supabase SQL editor).

## Verify (from worker/)
- npm run typecheck   # tsc --noEmit
- npm run build       # wrangler deploy --dry-run (bundle without publishing)
- npm run deploy      # wrangler deploy (uses root wrangler.jsonc)
