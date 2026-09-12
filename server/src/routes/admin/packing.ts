import { Router } from 'express';
import { prisma } from '../../db';

export const adminPackingRouter = Router();

adminPackingRouter.get('/', async (_req, res) => {
  res.json(await prisma.packingGroup.findMany({ orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' } } } }));
});

adminPackingRouter.post('/groups', async (req, res) => {
  const { id, items, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.packingGroup.create({ data: fields }));
});

adminPackingRouter.put('/groups/:id', async (req, res) => {
  const { id, items, ...fields } = req.body ?? {};
  res.json(await prisma.packingGroup.update({ where: { id: req.params.id }, data: fields }));
});

adminPackingRouter.delete('/groups/:id', async (req, res) => {
  await prisma.packingGroup.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

adminPackingRouter.post('/groups/:groupId/items', async (req, res) => {
  const { id, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.packingItem.create({ data: { ...fields, groupId: req.params.groupId } }));
});

adminPackingRouter.put('/items/:id', async (req, res) => {
  const { id, groupId, ...fields } = req.body ?? {};
  res.json(await prisma.packingItem.update({ where: { id: req.params.id }, data: fields }));
});

adminPackingRouter.delete('/items/:id', async (req, res) => {
  await prisma.packingItem.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
