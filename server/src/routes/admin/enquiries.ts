import { Router } from 'express';
import { prisma } from '../../db';

export const adminEnquiriesRouter = Router();

adminEnquiriesRouter.get('/', async (_req, res) => {
  res.json(await prisma.customizeEnquiry.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminEnquiriesRouter.delete('/:id', async (req, res) => {
  await prisma.customizeEnquiry.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
