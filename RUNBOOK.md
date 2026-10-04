# Umrah Companion — Operations Runbook

This runbook documents common operational procedures, known issues, and their resolutions for the Umrah Companion project running on Hostinger VPS (srv1164487.hstgr.cloud / 82.112.227.246).

---

## Container Architecture

All services are isolated Docker containers. **Restarting one container does NOT affect any other container.**

| Container | Image | Domain | Role |
|---|---|---|---|
| `umrah-api` | custom build | api.alzakwaantours.com | Node.js REST API |
| `umrah-admin` | nginx:alpine | admin.alzakwaantours.com | React admin panel |
| `umrah-translate` | libretranslate | (internal) | Translation service |
| `umrah-companion` | nginx:alpine | companion.alzakwaantours.com | Expo web PWA |
| `n8n-traefik-1` | traefik:v2 | (shared reverse proxy) | TLS termination + routing |

All containers share the `website` Docker network. Traefik routes inbound traffic by hostname.

---

## Common Commands

```bash
# View all running containers
docker ps

# Restart a single service (safe — no impact on others)
docker compose -f /docker/umrahcompanion/docker-compose.yml restart companion
docker compose -f /docker/umrahcompanion/docker-compose.yml restart api
docker compose -f /docker/umrahcompanion/docker-compose.yml restart admin

# View logs for a service
docker logs umrah-companion --tail 50
docker logs umrah-api --tail 50
docker logs n8n-traefik-1 --tail 50

# Rebuild and redeploy companion (after web build)
docker compose -f /docker/umrahcompanion/docker-compose.yml up -d --force-recreate companion

# Rebuild Expo web app
cd /var/www/umrahcompanion/mobile && npx expo export --platform web
```

---

## SSL / HTTPS Issues

### Symptom: "Unsafe to visit" or browser SSL warning on a domain

**Root cause:** Traefik uses Let's Encrypt (ACME HTTP-01 challenge) to auto-issue certs. If the DNS A record for a domain did not exist or hadn't propagated when the container first registered with Traefik, the challenge fails (NXDOMAIN error).

**How to diagnose:**
```bash
# 1. Confirm DNS is propagated
dig +short <domain> @8.8.8.8
# Should return: 82.112.227.246

# 2. Check if cert is already in ACME storage
cat /var/lib/docker/volumes/traefik_data/_data/acme.json | \
  python3 -c "import sys,json; d=json.load(sys.stdin); \
  print([c.get('domain',{}).get('main') for v in d.values() for c in v.get('Certificates',[]) or []])"

# 3. Check Traefik logs for errors
docker logs n8n-traefik-1 2>&1 | grep -i '<domain>' | tail -10
```

**Fix (DNS not yet propagated):** Wait 5–30 minutes for DNS TTL, then run Fix #2 below.

**Fix (DNS is propagated but cert still missing):**
```bash
# Restart Traefik — clears in-memory ACME failure state; all stored certs
# (in acme.json) are preserved, so no other services lose their certs.
# Traefik will immediately attempt fresh ACME challenges for any missing cert.
docker restart n8n-traefik-1

# Wait ~60 seconds then confirm cert appeared in acme.json
cat /var/lib/docker/volumes/traefik_data/_data/acme.json | \
  python3 -c "import sys,json; d=json.load(sys.stdin); \
  certs=[c.get('domain',{}).get('main') for v in d.values() for c in v.get('Certificates',[]) or []]; \
  print(certs)"
```

**Why restarting Traefik is safe:** Traefik stores all issued certs in `/var/lib/docker/volumes/traefik_data/_data/acme.json`. On restart, it reads this file and reloads all existing certs immediately — other services like n8n, admin, api experience only 2–5 seconds of downtime.

**ACME rate limits:** Let's Encrypt allows 5 failed authorizations per account per hostname per hour. If you see error 429 "too many failed authorizations", wait 1 hour before retrying.

---

## Deploying a New Web Build

```bash
# 1. Navigate to mobile project
cd /var/www/umrahcompanion/mobile

# 2. Build the Expo web bundle
npx expo export --platform web
# Output goes to: /var/www/umrahcompanion/mobile/dist/

# 3. Restart companion container to serve new build
docker compose -f /docker/umrahcompanion/docker-compose.yml restart companion
```

The companion nginx container mounts `/var/www/umrahcompanion/mobile/dist` as read-only — so a restart picks up the new build immediately.

---

## File Locations

| File | Purpose |
|---|---|
| `/docker/umrahcompanion/docker-compose.yml` | All 4 service definitions + network config |
| `/docker/umrahcompanion/nginx/companion.conf` | nginx SPA routing config for companion |
| `/var/www/umrahcompanion/mobile/` | Expo React Native source code |
| `/var/www/umrahcompanion/mobile/dist/` | Expo web build output (served by nginx) |
| `/var/www/umrahcompanion/server/` | Node.js API source |
| `/var/www/umrahcompanion/admin/dist/` | React admin panel build |
| `/var/www/umrahcompanion/data/` | SQLite database (dev.db) + persistent data |
| `/var/lib/docker/volumes/traefik_data/_data/acme.json` | Let's Encrypt certificates (all domains) |
| `/var/www/umrahcompanion/CLAUDE.md` | Project context for Claude AI sessions |

---

## Known Issues & Resolutions

### 2026-10-04 — companion.alzakwaantours.com SSL failure on first deploy
- **Issue:** DNS A record added moments before container start → Let's Encrypt got NXDOMAIN during HTTP-01 challenge → cert not issued.
- **Resolution:** Waited for DNS propagation (confirmed via `dig +short`), then `docker restart n8n-traefik-1` → cert issued within 60 seconds.
- **Lesson:** Always add DNS record 5+ minutes before first container start.

### 2026-09-13 — admin.alzakwaantours.com ACME rate-limited (error 429)
- **Issue:** Too many failed auth attempts (5) in 1 hour for admin domain → Let's Encrypt rate-limited.
- **Resolution:** Waited 1 hour for rate limit window to expire, then cert was auto-issued on next Traefik retry.
- **Lesson:** Fix DNS before deploying, not after repeated retries.
