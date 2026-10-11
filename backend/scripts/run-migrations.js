import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// load repo root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MIGRATIONS_DIR = path.resolve(__dirname, '../prisma/migrations');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required to run database migrations');
}
const poolConfig = { connectionString };
if (/sslmode=require|neon.tech/.test(connectionString) || process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: false };
}
const pool = new Pool(poolConfig);

async function run() {
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
  if (!files.length) {
    console.log('No migration files found.');
    process.exit(0);
  }

  const client = await pool.connect();
  try {
    // Ensure migrations tracking table exists
    await client.query(`CREATE TABLE IF NOT EXISTS public.applied_migrations (name text PRIMARY KEY, applied_at timestamptz DEFAULT now())`);

    for (const file of files) {
      const already = await client.query('SELECT 1 FROM public.applied_migrations WHERE name = $1 LIMIT 1', [file]);
      if (already.rowCount > 0) {
        console.log('Skipping already applied migration:', file);
        continue;
      }

      const full = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(full, 'utf8');
      console.log('Running migration:', file);

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO public.applied_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log('Applied migration:', file);
      } catch (e) {
        await client.query('ROLLBACK');
        const msg = (e && e.message) ? e.message.toLowerCase() : '';
        if (msg.includes('already exists') || msg.includes('duplicate') || msg.includes('already an object named')) {
          console.warn(`Migration ${file} likely already applied (detected '${e.message}'). Marking as applied.`);
          try {
            await client.query('INSERT INTO public.applied_migrations (name) VALUES ($1)', [file]);
          } catch (inner) {
            console.warn('Failed to mark migration as applied:', inner.message || inner);
          }
          continue;
        }
        throw e;
      }
    }

    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
