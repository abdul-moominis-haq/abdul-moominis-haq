import { Client } from 'pg';
import '../src/loadEnv.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1);
}

const useSsl = /sslmode=require|neon.tech/.test(connectionString) || process.env.NODE_ENV === 'production';
const clientConfig = { connectionString };
if (useSsl) clientConfig.ssl = { rejectUnauthorized: false };

const client = new Client(clientConfig);

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to Neon Postgres successfully.');

    const result = await client.query('SELECT version()');
    console.log('Postgres version:', result.rows[0].version);

    const currentUser = await client.query('SELECT current_user, session_user');
    console.log('Current user:', currentUser.rows[0]);
  } catch (error) {
    console.error('Failed to connect to Neon Postgres:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
