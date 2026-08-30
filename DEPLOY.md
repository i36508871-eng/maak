# Maak — Deploy

Sprint 4 production setup. Frontend on GitHub Pages; the Node backend (server/) on Fly.io with a persistent volume so SQLite survives restarts.

## Architecture

    User -> maak PWA (GitHub Pages) -> Public API (Fly.io) -> SQLite (persistent volume) -> Providers

## Why Fly.io

Persistent volume (no data loss on restart/redeploy), free tier, native Node + Dockerfile + SQLite-on-volume, region near MA. The backend already honors PORT / MAAK_DB_PATH / MAAK_ALLOW_ORIGIN, so the same image runs anywhere.

## 1) Deploy the backend (manual, one time)

Prereq: a Fly.io account and flyctl (https://fly.io/docs/hands-on/install-flyctl/).

From the repo root:

    fly auth login
    cd server
    fly launch --no-deploy          # if "maak-api" taken, pick a unique app name; fly generated fly.toml is superseded by the committed one
    fly volumes create maak_data --region fra --size 1
    fly deploy
    fly secrets set MAAK_ALLOW_ORIGIN=https://i36508871-eng.github.io

fly deploy prints the public URL, e.g. https://maak-api.fly.dev.

Notes:
- server/fly.toml sets MAAK_PORT=8080, MAAK_DB_PATH=/data/maak.db, mounts the volume at /data, and probes /health.
- maak_data (1 GB) persists the SQLite file across restart/redeploy.
- On first boot the DB is empty and the server auto-seeds the 4 providers.

## 2) Verify the public backend

    curl https://maak-api.fly.dev/health
    curl https://maak-api.fly.dev/api/providers
    curl https://maak-api.fly.dev/api/providers/1

Expect: /health -> {"ok":true,...}; /api/providers -> 4 providers; /api/providers/1 -> first provider.

## 3) Point the published frontend at the public API

The deploy-pages workflow runs npm run build with no secret injection, BUT Vite auto-loads .env.production during the production build. Committing .env.production is enough — no workflow edit is needed.

Create .env.production at the repo root:

    VITE_API_URL=https://maak-api.fly.dev

Then push. GitHub Pages rebuilds and the frontend calls the live API.

## 4) End-to-end test

Open https://i36508871-eng.github.io/maak/ — providers must appear from the live API (no error state, no mock fallback).

## Variables

- VITE_API_URL   : public backend URL for the production frontend build (.env.production, NOT a secret).
- PORT/MAAK_PORT : backend listen port. Fly uses MAAK_PORT=8080.
- MAAK_DB_PATH   : SQLite path. Fly: /data/maak.db (persistent volume).
- MAAK_ALLOW_ORIGIN : CORS origin = the published frontend.

## Persistence note

SQLite lives on a persistent Fly volume -> data survives restart/redeploy. When user-writable data arrives in a later sprint (bookings, etc.), re-evaluate: keep the volume, or migrate to PostgreSQL. For this Sprint (read-only seed providers) the volume already satisfies the no-data-loss requirement.
