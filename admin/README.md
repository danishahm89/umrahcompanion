# Umrah Companion — admin panel

Vite + React + TypeScript staff web app for managing everything the mobile app shows:
packages, guide content, duas, packing/vaccine checklists, news (with an approval
queue), Nusuk links, FAQ, services, contact info, app settings, and customize-package
enquiries submitted from the app.

## Setup

Start the `server` app first.

```sh
npm install
cp .env.example .env    # VITE_API_URL, defaults to http://localhost:4000/api
npm run dev              # http://localhost:5173
```

Seeded login: `admin@alzakwaantours.in` / `umrah-admin-2026`.

## Structure

- `src/components/TranslatedListEditor.tsx` — a generic list+form CRUD kit for the
  ~6 collections that are all "an ordered list of EN/HI/UR fields" (guide rituals,
  first-time steps, vaccines, Nusuk links, FAQ, services) — configured per page rather
  than reimplemented each time.
- `src/pages/PackagesPage.tsx`, `DuasPage.tsx`, `PackingPage.tsx`, `NewsPage.tsx` —
  bespoke pages for the collections with nested data (itinerary/inclusions per package,
  duas per stage, items per packing group, items per news source).
- `src/pages/ContactPage.tsx` — the two singleton records (contact/links, app settings).
- `src/pages/EnquiriesPage.tsx` — read-only leads from the app's Customize screen.

## Not included (deliberately, for now)

- CSV import for packages (shown as a button in the original design mockup, never
  specified further) — package rows are added/edited one at a time instead.
- Any live sync from Nusuk/Saudi government news sources — news items are entered and
  approved by staff here, matching what the design itself calls for.
