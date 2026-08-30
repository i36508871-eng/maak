# maak Worker

Cloudflare Worker (public API). Reads providers from Supabase PostgreSQL via the Supabase REST (PostgREST) API using pure fetch — no DB driver, no nodejs_compat, no Hyperdrive, no filesystem.

## Endpoints
- GET  /health
- GET  /api/providers
- GET  /api/providers/:id
- POST /admin/seed?token=<ADMIN_TOKEN>   (idempotent upsert of the 4 providers)

## Setup
1. npm install
2. Set secrets (never committed):
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   npx wrangler secret put ADMIN_TOKEN
   (MAAK_ALLOW_ORIGIN is a var in wrangler.jsonc)
3. For local dev, create .dev.vars (gitignored) with the same four keys as NAME=VALUE lines, then: npm run dev
4. Create the table once: paste db/schema.sql into the Supabase SQL editor.
5. Seed: POST https://maak-api.<sub>.workers.dev/admin/seed?token=<ADMIN_TOKEN>
   (or paste db/seed.sql into the Supabase SQL editor)

## Deploy
npm run deploy

## Verify
- npm run typecheck   (tsc --noEmit)
- npm run build       (wrangler deploy --dry-run — bundles without publishing)
