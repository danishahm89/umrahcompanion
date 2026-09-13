import { Router } from 'express';
import { prisma } from '../../db';
import { autoFillTranslations } from '../../services/translate';

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

// The 4 room-sharing prices the admin can fill in; priceInr (the "from" price shown in list
// views and the WhatsApp message) is auto-set to whichever of these is lowest, since larger
// sharing is normally cheaper per person and admins shouldn't have to keep it in sync by hand.
const SHARE_PRICE_FIELDS = ['price2Share', 'price3Share', 'price4Share', 'price5Share'] as const;

function computeFromPrice(fields: NestedRow): number | undefined {
  const prices = SHARE_PRICE_FIELDS
    .map((k) => fields[k])
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  return prices.length ? Math.min(...prices) : undefined;
}

async function splitBody(body: Record<string, unknown>) {
  const { id, createdAt, updatedAt, itinerary, inclusions, ...fields } = body;
  const itineraryRows = ((itinerary as NestedRow[] | undefined) ?? []).map(cleanNested);
  const inclusionRows = ((inclusions as NestedRow[] | undefined) ?? []).map(cleanNested);

  // Auto-translate anything the admin left blank in Hindi/Urdu — on the package itself and on
  // each itinerary/inclusion row — before saving.
  await autoFillTranslations(fields, ['name', 'city', 'meals']);
  await Promise.all(itineraryRows.map((row) => autoFillTranslations(row, ['key', 'text'])));
  await Promise.all(inclusionRows.map((row) => autoFillTranslations(row, ['text'])));

  // Falls back to whatever priceInr the client sent (or 0) only if no share price was set at
  // all — the admin form always sends at least one, so this is just a defensive floor.
  const fromPrice = computeFromPrice(fields);
  fields.priceInr = fromPrice ?? (typeof fields.priceInr === 'number' ? fields.priceInr : 0);

  return { fields, itinerary: itineraryRows, inclusions: inclusionRows };
}

adminPackagesRouter.post('/', async (req, res) => {
  const { fields, itinerary, inclusions } = await splitBody(req.body ?? {});
  const created = await prisma.package.create({
    data: {
      ...fields,
      departDate: new Date(fields.departDate as string),
      ...(fields.flightDepartureAt ? { flightDepartureAt: new Date(fields.flightDepartureAt as string) } : {}),
      ...(fields.flightReturnAt ? { flightReturnAt: new Date(fields.flightReturnAt as string) } : {}),
      itinerary: { create: itinerary.map((it, order) => ({ ...it, order })) },
      inclusions: { create: inclusions.map((inc, order) => ({ ...inc, order })) },
    } as never,
    include: { itinerary: true, inclusions: true },
  });
  res.status(201).json(created);
});

adminPackagesRouter.put('/:id', async (req, res) => {
  const { fields, itinerary, inclusions } = await splitBody(req.body ?? {});
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
        flightDepartureAt: fields.flightDepartureAt ? new Date(fields.flightDepartureAt as string) : null,
        flightReturnAt: fields.flightReturnAt ? new Date(fields.flightReturnAt as string) : null,
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
