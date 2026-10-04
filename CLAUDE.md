# Umrah Companion — Project Context for Claude


## 📕 Runbook (Issue Resolution)

For operational procedures, SSL fixes, deployment steps, and known issue resolutions:
**Read `/var/www/umrahcompanion/RUNBOOK.md` first** before troubleshooting.

Key topics covered:
- SSL/HTTPS cert failures and how to fix them (Traefik ACME)
- Deploying new web builds
- Container restart safety (isolated, no cross-impact)
- File locations reference
- Known issues log with resolutions

## Project Overview
Al Zakwaan Tours' Umrah Companion app. Live at alzakwaantours.com.
Owner: Danish Ahmed (danishahm89@gmail.com)

## VPS Details
- Provider: Hostinger VPS
- IP: 82.112.227.246
- Hostname: srv1164487.hstgr.cloud
- Access: Hostinger hpanel → VPS → Web Terminal

## Architecture
All services run in Docker with Traefik reverse proxy (SSL via Let's Encrypt).
External Docker network: `website` (shared by all public services)
Cert resolver: `mytlschallenge`

## Directory Structure
```
/var/www/umrahcompanion/
  mobile/          ← Expo/React Native app (source of truth)
    src/           ← App source (screens, components, api, etc.)
    dist/          ← Web build output (run: npx expo export --platform web)
    package.json   ← expo ~57, react-native-web ~0.21.0, react-dom 19.2.3
  server/          ← Node.js/Express API backend
  admin/
    dist/          ← Admin panel static build
  data/            ← SQLite database (dev.db)
  translate-models/ ← LibreTranslate language models
  CLAUDE.md        ← This file

/docker/umrahcompanion/
  docker-compose.yml  ← All services defined here
  nginx/
    companion.conf   ← nginx SPA config for companion service
```

## Services & Domains
| Service | Container | Domain | Notes |
|---------|-----------|--------|-------|
| API | umrah-api | api.alzakwaantours.com | Node/Express + SQLite |
| Admin | umrah-admin | admin.alzakwaantours.com | Static nginx |
| Companion (PWA) | umrah-companion | companion.alzakwaantours.com | Static nginx, Expo web build |
| Translate | umrah-translate | internal only | LibreTranslate (en,hi,ur) |

## API Configuration
- Backend URL: https://api.alzakwaantours.com/api
- JWT Secret: in docker-compose.yml
- Database: SQLite at /var/www/umrahcompanion/data/dev.db

## Key Commands

### Rebuild web app after code changes
```bash
cd /var/www/umrahcompanion/mobile
npx expo export --platform web
# Then restart companion container:
docker compose -f /docker/umrahcompanion/docker-compose.yml restart companion
```

### Docker management
```bash
# View all containers
docker compose -f /docker/umrahcompanion/docker-compose.yml ps

# Restart specific service
docker compose -f /docker/umrahcompanion/docker-compose.yml restart <service>

# View logs
docker compose -f /docker/umrahcompanion/docker-compose.yml logs -f companion

# Start new service
docker compose -f /docker/umrahcompanion/docker-compose.yml up -d <service>
```

### Rebuild API after server changes
```bash
docker compose -f /docker/umrahcompanion/docker-compose.yml build api
docker compose -f /docker/umrahcompanion/docker-compose.yml up -d api
```

## Mobile App Tech Stack
- Framework: Expo ~57 (React Native)
- Web support: react-native-web ~0.21.0
- Navigation: React Navigation
- State: Local state + AsyncStorage
- API: Custom fetch wrapper in src/api/client.ts
- i18n: src/i18n/ (multi-language support)
- Theme: src/theme/

## Google Play Console
- App: Umrah Companion
- Package: com.alzakwaantours.umrahcompanion
- Bundle ID (iOS): com.alzakwaantours.umrahcompanion
- Expo owner: alzakwaantours
- Privacy Policy URL: https://companion.alzakwaantours.com/privacy (once DNS is live)
- Status: Setup in progress (data safety, store listing remaining)

## DNS Records (at Hostinger)
- api.alzakwaantours.com → 82.112.227.246
- admin.alzakwaantours.com → 82.112.227.246
- companion.alzakwaantours.com → 82.112.227.246 (ADD THIS if not done)

## Pending Tasks
- [ ] Add DNS A record: companion → 82.112.227.246 (in Hostinger DNS panel)
- [ ] Fill Google Play Console data safety section
- [ ] Add Play Console store listing (description, screenshots)
- [ ] Set privacy policy URL in Play Console to https://companion.alzakwaantours.com/privacy
