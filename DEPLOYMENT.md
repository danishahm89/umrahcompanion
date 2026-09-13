# Free production hosting (backend + admin panel)

This covers hosting the **API** and the **admin panel** so they run all the time, without
your own PC being on. (Publishing the mobile app to the App Store / Play Store is a
separate topic — see `mobile/DEPLOYMENT.md`.)

Stack, all free tier, no credit card required for any of them:

- **Neon** — hosted Postgres (replaces your local SQLite file, which can't survive a
  redeploy on a free host)
- **Render** — runs the Node/Express API
- **Vercel** — hosts the admin panel (static React build)

Trade-off to know upfront: Render's free tier **spins your server down after ~15 minutes
of no traffic**, then takes 30-60 seconds to wake up on the next request. Fine for now;
if that becomes annoying once you have real users, upgrading Render to a paid plan
(~$7/mo) removes it — nothing else about this setup would need to change.

## 1. Create the database (Neon)

1. Sign up free at https://neon.tech (no card needed).
2. Create a project (any name/region).
3. On the project dashboard, copy the **connection string** (starts `postgresql://...`).
   Keep it somewhere safe — you'll paste it into Render next, and use it once locally to
   seed the database.

## 2. Deploy the API (Render)

1. Sign up free at https://render.com, connect your GitHub account, and give it access
   to the `umrahcompanion` repo.
2. New → Web Service → pick `umrahcompanion`. Render should detect `render.yaml` at the
   repo root and pre-fill everything (root directory `server`, build/start commands). If
   it doesn't pick it up automatically, set these manually:
   - **Root directory**: `server`
   - **Build command**: `npm install && npm run render:build`
   - **Start command**: `npm start`
3. Under **Environment**, add:
   - `DATABASE_URL` — paste the Neon connection string from step 1
   - `JWT_SECRET` — if `render.yaml` was picked up this is already generated for you;
     otherwise set it to any long random string yourself
4. Deploy. First deploy takes a few minutes (it's installing dependencies and creating
   the Postgres tables via `prisma db push`). When it's live, Render shows you the
   service's URL, e.g. `https://umrah-companion-api.onrender.com` — note it down.

### One-time: seed the database

The `render:build` step creates empty tables but doesn't fill them with your content —
seeding wipes and rewrites everything, so it must **never** run automatically on every
deploy (it would erase real admin edits and enquiries). Run it once, from your own
machine, pointed at Neon instead of your local file:

```
cd server
```

Open `.env` and temporarily replace the `DATABASE_URL` line with your Neon connection
string, then:

```
npm run generate:postgres-schema
npx prisma generate --schema=prisma/schema.postgres.prisma
npm run seed
```

Afterwards, put `.env` back to `DATABASE_URL="file:./dev.db"` so your local dev setup is
unaffected, and run `npx prisma generate` (no `--schema` flag) once to switch the local
Prisma Client back to SQLite.

## 3. Deploy the admin panel (Vercel)

1. Sign up free at https://vercel.com, connect GitHub, import the `umrahcompanion` repo.
2. Set **Root Directory** to `admin`. Vercel auto-detects Vite (build command
   `npm run build`, output `dist`) — no changes needed there.
3. Add an environment variable: `VITE_API_URL` = `https://umrah-companion-api.onrender.com/api`
   (your Render URL from step 2, with `/api` on the end).
4. Deploy. Vercel gives you a URL like `https://umrahcompanion.vercel.app` — that's your
   real admin panel, reachable from anywhere, no PC required. Log in with the same
   `admin@alzakwaantours.com` account (change that password once this is live).

## 4. Point the mobile app at production

In `mobile/.env`, set:

```
EXPO_PUBLIC_API_URL=https://umrah-companion-api.onrender.com/api
```

Then rebuild the Android APK (`npx eas-cli build --platform android --profile preview`)
so the installed app talks to the live backend instead of your PC's LAN IP. Your PC no
longer needs to be running for the app or the admin panel to work.

## Ongoing: schema changes

Whenever the Prisma schema changes and you redeploy, Render's build step
(`prisma db push --accept-data-loss`) syncs the Postgres tables to match automatically —
that's the "plug and play" part, no manual migration steps on the free tier. The
trade-off is in the name: if a change *removes* a field that already has data in it,
that data is dropped silently rather than blocked with a prompt. Fine for this app's
current scale; worth a manual backup (Neon has a dashboard export) before a schema
change you're unsure about once there's real customer data in there.
