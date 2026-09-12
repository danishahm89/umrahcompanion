import path from 'node:path';
import { defineConfig } from 'vitest/config';

const testDbPath = path.join(__dirname, 'prisma', 'test.db');

export default defineConfig({
  test: {
    globalSetup: './tests/globalSetup.ts',
    // Isolates the test run from prisma/dev.db — without this, tests hit the same
    // database as `npm run dev` and mutate it (e.g. a package's price kept incrementing
    // every test run).
    env: { DATABASE_URL: `file:${testDbPath}` },
  },
});
