import { Router } from 'express';
import { prisma } from '../../db';

export const adminNewsRouter = Router();

adminNewsRouter.get('/sources', async (_req, res) => {
  res.json(await prisma.newsSource.findMany({ orderBy: { name: 'asc' } }));
});

adminNewsRouter.post('/sources', async (req, res) => {
  const { id, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.newsSource.create({ data: fields }));
});

adminNewsRouter.put('/sources/:id', async (req, res) => {
  const { id, ...fields } = req.body ?? {};
  res.json(await prisma.newsSource.update({ where: { id: req.params.id }, data: fields }));
});

adminNewsRouter.delete('/sources/:id', async (req, res) => {
  await prisma.newsSource.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// Review queue: every item, approved or not.
adminNewsRouter.get('/items', async (_req, res) => {
  res.json(await prisma.newsItem.findMany({ orderBy: { publishedAt: 'desc' }, include: { source: true } }));
});

adminNewsRouter.post('/items', async (req, res) => {
  const { id, source, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.newsItem.create({
    data: { ...fields, publishedAt: fields.publishedAt ? new Date(fields.publishedAt) : new Date() },
  }));
});

adminNewsRouter.put('/items/:id', async (req, res) => {
  const { id, source, ...fields } = req.body ?? {};
  res.json(await prisma.newsItem.update({
    where: { id: req.params.id },
    data: { ...fields, ...(fields.publishedAt ? { publishedAt: new Date(fields.publishedAt) } : {}) },
  }));
});

adminNewsRouter.delete('/items/:id', async (req, res) => {
  await prisma.newsItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
