import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = path.join(__dirname, '..');
const dbPath = path.join(root, 'prisma', 'test.db');
const env = { ...process.env, DATABASE_URL: `file:${dbPath}` };

export async function setup() {
  if (existsSync(dbPath)) rmSync(dbPath);
  execSync('npx prisma migrate deploy', { cwd: root, env, stdio: 'inherit' });
  execSync('npx ts-node --transpile-only prisma/seed.ts', { cwd: root, env, stdio: 'inherit' });
}

export async function teardown() {
  if (existsSync(dbPath)) rmSync(dbPath);
}
