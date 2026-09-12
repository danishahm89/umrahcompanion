import { Router } from 'express';
import { prisma } from '../../db';

export const adminDuasRouter = Router();

adminDuasRouter.get('/', async (_req, res) => {
  res.json(await prisma.duaStage.findMany({ orderBy: { order: 'asc' }, include: { duas: { orderBy: { order: 'asc' } } } }));
});

adminDuasRouter.post('/stages', async (req, res) => {
  const { id, duas, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.duaStage.create({ data: fields }));
});

adminDuasRouter.put('/stages/:id', async (req, res) => {
  const { id, duas, ...fields } = req.body ?? {};
  res.json(await prisma.duaStage.update({ where: { id: req.params.id }, data: fields }));
});

adminDuasRouter.delete('/stages/:id', async (req, res) => {
  await prisma.duaStage.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

adminDuasRouter.post('/stages/:stageId/duas', async (req, res) => {
  const { id, ...fields } = req.body ?? {};
  res.status(201).json(await prisma.dua.create({ data: { ...fields, stageId: req.params.stageId } }));
});

adminDuasRouter.put('/duas/:id', async (req, res) => {
  const { id, stageId, ...fields } = req.body ?? {};
  res.json(await prisma.dua.update({ where: { id: req.params.id }, data: fields }));
});

adminDuasRouter.delete('/duas/:id', async (req, res) => {
  await prisma.dua.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
