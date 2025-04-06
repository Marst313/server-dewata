import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const caPath = path.resolve(__dirname, '../../certs/ca.pem');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
    // ca: fs.readFileSync(caPath).toString(),
  },
});

export const db = drizzle(pool);

// Fungsi untuk menguji koneksi
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT VERSION()');
    console.log('✅Database version:', result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to database:', error instanceof Error ? error.message : String(error));
    return false;
  }
};
