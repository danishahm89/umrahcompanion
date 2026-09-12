import { Router } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Delegate = {
  findMany: (args?: any) => Promise<unknown[]>;
  create: (args: any) => Promise<unknown>;
  update: (args: any) => Promise<unknown>;
  delete: (args: any) => Promise<unknown>;
};

/** Mounts list/create/update/delete for a flat, `order`-sorted, translated-fields Prisma model. */
export function orderedResourceRouter(delegate: Delegate) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await delegate.findMany({ orderBy: { order: 'asc' } }));
  });

  router.post('/', async (req, res) => {
    const { id, createdAt, updatedAt, ...data } = req.body ?? {};
    res.status(201).json(await delegate.create({ data }));
  });

  router.put('/:id', async (req, res) => {
    const { id, createdAt, updatedAt, ...data } = req.body ?? {};
    res.json(await delegate.update({ where: { id: req.params.id }, data }));
  });

  router.delete('/:id', async (req, res) => {
    await delegate.delete({ where: { id: req.params.id } });
    res.status(204).end();
  });

  return router;
}
