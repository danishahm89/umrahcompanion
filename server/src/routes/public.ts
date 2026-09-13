import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';

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
