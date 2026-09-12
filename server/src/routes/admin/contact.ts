import { Router } from 'express';
import { prisma } from '../../db';

export const adminContactRouter = Router();

adminContactRouter.get('/contact', async (_req, res) => {
  const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
  if (!contact) return res.json(null);
  res.json({ ...contact, offices: JSON.parse(contact.offices) });
});

adminContactRouter.put('/contact', async (req, res) => {
  const { offices, ...fields } = req.body ?? {};
  const data = { ...fields, offices: JSON.stringify(offices ?? []) };
  const updated = await prisma.contactInfo.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  res.json({ ...updated, offices: JSON.parse(updated.offices) });
});

adminContactRouter.get('/settings', async (_req, res) => {
  res.json(await prisma.appSettings.findUnique({ where: { id: 1 } }));
});

adminContactRouter.put('/settings', async (req, res) => {
  const { countdownTarget, ...fields } = req.body ?? {};
  const data = { ...fields, ...(countdownTarget ? { countdownTarget: new Date(countdownTarget) } : {}) };
  const updated = await prisma.appSettings.upsert({
    where: { id: 1 },
    create: { id: 1, countdownTarget: new Date(countdownTarget ?? Date.now()), ...fields },
    update: data,
  });
  res.json(updated);
});
