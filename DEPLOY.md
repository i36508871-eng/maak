# Maak — Deploy

Sprint 4A production setup. Frontend on GitHub Pages; the Node backend on a Render Free Web Service; the database is PostgreSQL on Supabase (free). No filesystem storage — all data lives in Postgres.

## Architecture

    User -> maak PWA (GitHub Pages) -> Public API (Render) -> PostgreSQL (Supabase) -> Providers

## 1) Create the Supabase project (manual)

- Sign up at supabase.com and create a new project.
- Project Settings -> Database -> Connection string -> copy the URI (postgres://...). This becomes DATABASE_URL.
- The providers table is created automatically on backend startup (CREATE TABLE IF NOT EXISTS).

## 2) Local backend setup

From server/:

    npm install
    DATABASE_URL="postgresql://postgres:PASSWORD@db.XX.supabase.co:5432/postgres" npm run db:init
    DATABASE_URL="..." npm run seed
    DATABASE_URL="..." npm run dev

Verify locally:

    curl http://localhost:8787/health
    curl http://localhost:8787/api/providers
    curl http://localhost:8787/api/providers/1

## 3) Deploy the backend on Render (manual)

Use the committed render.yaml (repo root): in the Render dashboard, New -> Blueprint, select this repo. Render reads render.yaml and creates a Web Service named maak-api.

Then set the secret env var in the Render dashboard (Environment -> Add Environment Variable):

    DATABASE_URL = <your Supabase connection string>

render.yaml already sets:
- rootDir: server
- buildCommand: npm install --omit=dev
- startCommand: npm start
- healthCheckPath: /health
- MAAK_ALLOW_ORIGIN = https://i36508871-eng.github.io
- NODE_VERSION = 20

The backend listens on 0.0.0.0 and uses the PORT Render injects. On first boot it creates the providers table and auto-seeds the 4 providers.

Render prints the public URL, e.g. https://maak-api.onrender.com.

Verify the public backend:

    curl https://maak-api.onrender.com/health
    curl https://maak-api.onrender.com/api/providers
    curl https://maak-api.onrender.com/api/providers/1

## 4) Point the published frontend at the public API

The deploy-pages workflow runs npm run build with no secret injection, but Vite auto-loads .env.production during the production build. Committing .env.production is enough — no workflow edit is needed.

Create .env.production at the repo root:

    VITE_API_URL=https://maak-api.onrender.com

Then push. GitHub Pages rebuilds and the frontend calls the live API.

## 5) End-to-end test

Open https://i36508871-eng.github.io/maak/ — providers must appear from the live API (no error state, no mock fallback).

## Variables

- VITE_API_URL       : public backend URL for the production frontend build (.env.production, NOT a secret).
- DATABASE_URL       : Supabase Postgres connection string (SECRET — set in Render dashboard, never committed).
- PORT / MAAK_PORT   : backend listen port. Render injects PORT.
- MAAK_ALLOW_ORIGIN  : CORS origin = the published frontend.

## Notes

- SQLite is no longer the production database; the filesystem is not used for data, so no persistent disk is needed on Render.
- The 4 providers are seeded from server/data/seed-providers.ts (unchanged data). Re-seed anytime with npm run seed.
- When user-writable data arrives in a later sprint, add a real migration tool; for now the single providers table is created idempotently at startup.
