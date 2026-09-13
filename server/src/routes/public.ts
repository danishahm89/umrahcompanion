import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { haversineMeters } from '../utils/geo';

export const publicRouter = Router();

publicRouter.get('/settings', async (_req, res) => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
  res.json(settings);
});

publicRouter.get('/contact', async (_req, res) => {
  const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
  if (!contact) return res.json(null);
  res.json({ ...contact, offices: JSON.parse(contact.offices) });
});

publicRouter.get('/packages', async (req, res) => {
  const type = typeof req.query.type === 'string' ? req.query.type : undefined;
  const packages = await prisma.package.findMany({
    where: { live: true, ...(type ? { type } : {}) },
    orderBy: { order: 'asc' },
  });
  res.json(packages);
});

publicRouter.get('/packages/:id', async (req, res) => {
  const pkg = await prisma.package.findFirst({
    where: { id: req.params.id, live: true },
    include: {
      itinerary: { orderBy: { order: 'asc' } },
      inclusions: { orderBy: { order: 'asc' } },
    },
  });
  if (!pkg) return res.status(404).json({ error: 'Package not found' });
  res.json(pkg);
});

publicRouter.get('/guide/rituals', async (_req, res) => {
  res.json(await prisma.guideRitual.findMany({ orderBy: { order: 'asc' } }));
});

publicRouter.get('/guide/steps', async (_req, res) => {
  res.json(await prisma.firstTimeStep.findMany({ orderBy: { order: 'asc' } }));
});

publicRouter.get('/duas', async (_req, res) => {
  const stages = await prisma.duaStage.findMany({
    orderBy: { order: 'asc' },
    include: { duas: { orderBy: { order: 'asc' } } },
  });
  res.json(stages);
});

publicRouter.get('/packing', async (_req, res) => {
  const groups = await prisma.packingGroup.findMany({
    orderBy: { order: 'asc' },
    include: { items: { orderBy: { order: 'asc' } } },
  });
  res.json(groups);
});

publicRouter.get('/vaccines', async (_req, res) => {
  res.json(await prisma.vaccineItem.findMany({ orderBy: { order: 'asc' } }));
});

publicRouter.get('/news', async (_req, res) => {
  const items = await prisma.newsItem.findMany({
    where: { approved: true },
    orderBy: { publishedAt: 'desc' },
    include: { source: true },
  });
  res.json(items);
});

publicRouter.get('/nusuk-links', async (_req, res) => {
  res.json(await prisma.nusukLink.findMany({ orderBy: { order: 'asc' } }));
});

publicRouter.get('/faq', async (_req, res) => {
  res.json(await prisma.faqItem.findMany({ orderBy: { order: 'asc' } }));
});

publicRouter.get('/services', async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  res.json(services.map((s) => ({ ...s, tags: JSON.parse(s.tags) })));
});

publicRouter.get('/ebooks', async (_req, res) => {
  res.json(await prisma.ebook.findMany({ orderBy: { order: 'asc' } }));
});

const enquirySchema = z.object({
  city: z.string().min(1),
  pax: z.number().int().positive(),
  nights: z.number().int().positive(),
  month: z.string().min(1),
  hotel: z.string().min(1),
  notes: z.string().optional(),
});

publicRouter.post('/enquiries', async (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const enquiry = await prisma.customizeEnquiry.create({ data: parsed.data });
  res.status(201).json(enquiry);
});

const ticketEnquirySchema = z.object({
  kind: z.enum(['air', 'train']),
  name: z.string().min(1),
  phone: z.string().min(1),
  fromPlace: z.string().min(1),
  toPlace: z.string().min(1),
  travelDate: z.coerce.date(),
  returnDate: z.coerce.date().optional(),
  passengers: z.number().int().positive(),
  classPref: z.string().min(1),
  tatkal: z.boolean().optional(),
  notes: z.string().optional(),
});

publicRouter.post('/ticket-enquiries', async (req, res) => {
  const parsed = ticketEnquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const enquiry = await prisma.ticketEnquiry.create({ data: parsed.data });
  res.status(201).json(enquiry);
});

// Free, no-API-key mosque search via OpenStreetMap's Overpass API — proxied server-side so
// the client never talks to a third-party API directly (avoids CORS/rate-limit issues and
// keeps the option open to cache or swap providers later without an app update).
publicRouter.get('/nearby-mosques', async (req, res) => {
  const lat = parseFloat(String(req.query.lat));
  const lng = parseFloat(String(req.query.lng));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat and lng query params are required' });
  }

  // 5km turned up nothing in areas where OSM's mosque tagging is sparse — 15km casts a much
  // wider net, and matching both amenity=mosque and building=mosque (a secondary tagging
  // convention some mappers use instead) plus relations (multi-way mosque complexes), not
  // just nodes/ways, catches more real-world entries.
  const radiusM = 15000;
  const tagFilters = ['["amenity"="mosque"]', '["building"="mosque"]'];
  const clauses = tagFilters.flatMap((tag) => [
    `node${tag}(around:${radiusM},${lat},${lng});`,
    `way${tag}(around:${radiusM},${lat},${lng});`,
    `relation${tag}(around:${radiusM},${lat},${lng});`,
  ]);
  const query = `[out:json][timeout:20];(${clauses.join('')});out center 30;`;

  // The free public Overpass instances are shared, unmetered infrastructure — any one of
  // them can be briefly overloaded (504/429). Try a short list in order instead of failing
  // the whole feature on the first one having a bad moment.
  const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
  ];

  // Node's fetch collapses any network-level failure (DNS, TLS, connection refused,
  // timeout) into a generic "fetch failed" — the real reason lives in `err.cause`, which
  // gets lost if we only keep `err.message`. Capture full detail per endpoint so a failure
  // is actually diagnosable instead of just "fetch failed".
  function describeError(err: unknown): string {
    if (!(err instanceof Error)) return String(err);
    if (err.name === 'AbortError') return 'timed out after 12s';
    const cause = (err as { cause?: unknown }).cause;
    if (cause instanceof Error) return `${err.message}: ${cause.message}`;
    return err.message;
  }

  let data: { elements?: Array<Record<string, unknown>> } | undefined;
  const attempts: string[] = [];
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 22000);
    try {
      const overpassRes = await fetch(endpoint, {
        method: 'POST',
        // Overpass's front-end rejects requests with no descriptive User-Agent or Accept
        // header (406 Not Acceptable) — it's meant to identify real API clients, not just
        // browsers, per their usage policy.
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json, text/plain, */*',
          'User-Agent': 'UmrahCompanionApp/1.0 (contact: info@alzakwaantours.in)',
        },
        body: query,
        signal: controller.signal,
      });
      if (!overpassRes.ok) throw new Error(`responded ${overpassRes.status}`);
      data = (await overpassRes.json()) as { elements?: Array<Record<string, unknown>> };
      break;
    } catch (err) {
      attempts.push(`${endpoint} -> ${describeError(err)}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  if (!data) throw new Error(`All Overpass mirrors failed:\n${attempts.join('\n')}`);

  type OverpassEl = { id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> };
  const results = ((data.elements ?? []) as OverpassEl[])
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      if (elLat == null || elLng == null) return null;
      return {
        id: String(el.id),
        name: el.tags?.name || el.tags?.['name:en'] || 'Mosque',
        lat: elLat,
        lng: elLng,
        distanceM: Math.round(haversineMeters(lat, lng, elLat, elLng)),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, 20);

  res.json(results);
});
