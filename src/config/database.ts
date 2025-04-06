import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fungsi untuk menguji koneksi
export const testConnection = async () => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT VERSION()');
    console.log('✅Database version:', result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to database:', error instanceof Error ? error.message : String(error));
    return false;
  }
};
