import { Router } from 'express';
import { prisma } from '../../db';

export const adminTicketEnquiriesRouter = Router();

adminTicketEnquiriesRouter.get('/', async (_req, res) => {
  res.json(await prisma.ticketEnquiry.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminTicketEnquiriesRouter.delete('/:id', async (req, res) => {
  await prisma.ticketEnquiry.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
