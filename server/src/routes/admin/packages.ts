import { Router } from 'express';
import { prisma } from '../../db';

export const adminPackagesRouter = Router();

adminPackagesRouter.get('/', async (_req, res) => {
  res.json(await prisma.package.findMany({
    orderBy: { order: 'asc' },
    include: { itinerary: { orderBy: { order: 'asc' } }, inclusions: { orderBy: { order: 'asc' } } },
  }));
});

adminPackagesRouter.get('/:id', async (req, res) => {
  const pkg = await prisma.package.findUnique({
    where: { id: req.params.id },
    include: { itinerary: { orderBy: { order: 'asc' } }, inclusions: { orderBy: { order: 'asc' } } },
  });
  if (!pkg) return res.status(404).json({ error: 'Package not found' });
  res.json(pkg);
});

type NestedRow = Record<string, unknown>;

// Nested Prisma `create` rejects the parent foreign key and any stale id/order —
// those come back from the client because GET included them on each row.
function cleanNested(row: NestedRow): NestedRow {
  const { id, packageId, order, ...rest } = row;
  return rest;
}

function splitBody(body: Record<string, unknown>) {
  const { id, createdAt, updatedAt, itinerary, inclusions, ...fields } = body;
  return {
    fields,
    itinerary: ((itinerary as NestedRow[] | undefined) ?? []).map(cleanNested),
    inclusions: ((inclusions as NestedRow[] | undefined) ?? []).map(cleanNested),
  };
}

adminPackagesRouter.post('/', async (req, res) => {
  const { fields, itinerary, inclusions } = splitBody(req.body ?? {});
  const created = await prisma.package.create({
    data: {
      ...fields,
      departDate: new Date(fields.departDate as string),
      itinerary: { create: itinerary.map((it, order) => ({ ...it, order })) },
      inclusions: { create: inclusions.map((inc, order) => ({ ...inc, order })) },
    } as never,
    include: { itinerary: true, inclusions: true },
  });
  res.status(201).json(created);
});

adminPackagesRouter.put('/:id', async (req, res) => {
  const { fields, itinerary, inclusions } = splitBody(req.body ?? {});
  // Delete-then-recreate the nested rows and the field update must commit or fail together —
  // otherwise a failed update (bad input, etc.) leaves the package with its itinerary wiped out.
  const updated = await prisma.$transaction(async (tx) => {
    await tx.itineraryItem.deleteMany({ where: { packageId: req.params.id } });
    await tx.packageInclusion.deleteMany({ where: { packageId: req.params.id } });
    return tx.package.update({
      where: { id: req.params.id },
      data: {
        ...fields,
        ...(fields.departDate ? { departDate: new Date(fields.departDate as string) } : {}),
        itinerary: { create: itinerary.map((it, order) => ({ ...it, order })) },
        inclusions: { create: inclusions.map((inc, order) => ({ ...inc, order })) },
      } as never,
      include: { itinerary: { orderBy: { order: 'asc' } }, inclusions: { orderBy: { order: 'asc' } } },
    });
  });
  res.json(updated);
});

adminPackagesRouter.delete('/:id', async (req, res) => {
  await prisma.package.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
