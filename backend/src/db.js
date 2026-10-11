import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

const useSsl = (() => {
  if (!connectionString) return false;
  // enable ssl when connection string indicates it or when running in production
  return /sslmode=require|neon.tech/.test(connectionString) || process.env.NODE_ENV === 'production';
})();

const poolConfig = {
  connectionString,
};

if (useSsl) {
  // Neon requires SSL; pg expects an `ssl` option object
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
