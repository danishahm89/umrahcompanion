# Umrah Companion

A trilingual (English / Hindi / Urdu) travel-services app for Alzakwaan Tours & Travels,
specialized in Umrah and Hajj services — implemented from the Claude Design handoff in
`project/`.

## Apps

- **`server/`** — Node.js + Express + Prisma (SQLite) API. Start this first.
- **`mobile/`** — Expo (React Native) app for pilgrims: 16 screens, EN/HI/UR, light/dark
  theme, live RTL↔LTR toggle for Urdu.
- **`admin/`** — Vite + React staff web app: packages, guide content, duas, checklists,
  news review queue, FAQ, services, contact info, and customize-package enquiries.

Each has its own README with setup steps. Quick start:

```sh
cd server && npm install && cp .env.example .env && npx prisma migrate dev && npm run seed && npm run dev
cd admin  && npm install && cp .env.example .env && npm run dev
cd mobile && npm install && cp .env.example .env && npx expo start
```

Seeded admin login: `admin@alzakwaantours.com` / `umrah-admin-2026`.

## Provenance

`README-design-handoff.md`, `chats/`, and `project/` are the original Claude Design
export this implementation was built from — kept for reference. The design's own
content (packages, guide steps, duas, packing/vaccine checklists, news, Nusuk links,
FAQ, services, contact info) was carried over verbatim into `server/prisma/seed.ts`.

Decisions made when scope was ambiguous (confirmed with the user before implementing):
stack is React Native/Expo + a real backend and admin panel (not just static app UI);
Hajj is a package `type` filter inside the Packages tab rather than a separate tab; and
photography stays as grayscale placeholders until real images are supplied.
