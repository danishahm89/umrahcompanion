import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// WAL mode lets SQLite serve reads while a write is in progress, instead of the default
// mode's exclusive lock — without it, the mobile app polling the API while the admin panel
// saves an edit can hit "database is locked" errors.
// PRAGMA journal_mode returns a row (the resulting mode), so it must go through $queryRawUnsafe —
// $executeRawUnsafe rejects any raw query that returns results.
prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL;').catch((err) => console.error('Failed to set WAL mode', err));
