# Umrah Companion — server

Node.js + TypeScript + Express + Prisma (SQLite) API backing the mobile app and admin panel.

## Setup

```sh
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed        # seeds all content in EN/HI/UR from the original design
npm run dev         # http://localhost:4000
```

Seeded admin login: `admin@alzakwaantours.in` / `umrah-admin-2026`.

## Structure

- `prisma/schema.prisma` — every content collection (packages, guide, duas, packing,
  vaccines, news, Nusuk links, FAQ, services, contact/settings, enquiries), each row
  carrying `En`/`Hi`/`Ur` fields directly rather than a separate translations table.
- `prisma/seed.ts` — the real EN/HI/UR content extracted from the Claude Design handoff.
- `src/routes/public` — read-only endpoints the mobile app calls (`/api/...`). Packages
  only return `live: true`; news only returns `approved: true`.
- `src/routes/admin` — JWT-protected CRUD for every collection (`/api/admin/...`),
  plus `/login`.
- `tests/api.test.ts` — supertest coverage of the core public + admin flows, run against
  an isolated `prisma/test.db` (migrated + seeded fresh by `tests/globalSetup.ts` before
  the run and deleted after) — **not** `prisma/dev.db`, so running tests never mutates
  your local dev data.

## Notes

- SQLite chosen for zero external services in dev; swap the `datasource` in
  `schema.prisma` to Postgres for production without touching application code.
- News is staff-curated (admin-entered + approved), not scraped live from Nusuk or
  Saudi government sources — matching what the design itself specifies ("Fetched items
  land in a review queue — staff approve and translate before they appear in the app").
  Wiring an actual scraper/integration is a deliberate follow-up, not done here.
