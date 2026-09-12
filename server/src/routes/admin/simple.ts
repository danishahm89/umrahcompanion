import { Router } from 'express';
import { prisma } from '../../db';
import { orderedResourceRouter } from './orderedResource';

export const adminSimpleRouter = Router();

adminSimpleRouter.use('/guide-rituals', orderedResourceRouter(prisma.guideRitual));
adminSimpleRouter.use('/guide-steps', orderedResourceRouter(prisma.firstTimeStep));
adminSimpleRouter.use('/vaccines', orderedResourceRouter(prisma.vaccineItem));
adminSimpleRouter.use('/nusuk-links', orderedResourceRouter(prisma.nusukLink));
adminSimpleRouter.use('/faq', orderedResourceRouter(prisma.faqItem));
adminSimpleRouter.use('/services', orderedResourceRouter(prisma.service));
