import { Router } from 'express';
import { requireAdmin } from '../../auth';
import { adminAuthRouter } from './auth';
import { adminSimpleRouter } from './simple';
import { adminPackagesRouter } from './packages';
import { adminDuasRouter } from './duas';
import { adminPackingRouter } from './packing';
import { adminNewsRouter } from './news';
import { adminContactRouter } from './contact';
import { adminEnquiriesRouter } from './enquiries';

export const adminRouter = Router();

adminRouter.use('/', adminAuthRouter);

adminRouter.use(requireAdmin);
adminRouter.use('/', adminSimpleRouter);
adminRouter.use('/packages', adminPackagesRouter);
adminRouter.use('/duas', adminDuasRouter);
adminRouter.use('/packing', adminPackingRouter);
adminRouter.use('/news', adminNewsRouter);
adminRouter.use('/', adminContactRouter);
adminRouter.use('/enquiries', adminEnquiriesRouter);
