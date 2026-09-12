import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../db';
import { signAdminToken } from '../../auth';

export const adminAuthRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

adminAuthRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signAdminToken({ sub: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});
