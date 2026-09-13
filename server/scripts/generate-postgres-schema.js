// Local dev stays on SQLite (prisma/schema.prisma, checked in as-is) so nothing about the
// day-to-day workflow changes. This script derives a Postgres-flavored copy of the *same*
// models for free-tier cloud hosting (Render + Neon), where SQLite's on-disk file wouldn't
// survive a redeploy. Run before building for that target — see DEPLOYMENT.md.
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const outPath = path.join(__dirname, '..', 'prisma', 'schema.postgres.prisma');

const src = fs.readFileSync(srcPath, 'utf8');

const sqliteBlock = /datasource db \{[^}]*provider = "sqlite"[^}]*\}/;
if (!sqliteBlock.test(src)) {
  console.error('Could not find the expected sqlite datasource block in schema.prisma — aborting.');
  process.exit(1);
}

const postgresBlock = 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}';
const out = src.replace(sqliteBlock, postgresBlock);

fs.writeFileSync(outPath, out);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
