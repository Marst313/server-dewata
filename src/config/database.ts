import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Fungsi untuk menguji koneksi
export const testConnection = async () => {
  try {
    const client = await db.connect();
    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Pelanggan Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pelanggan (
        id SERIAL PRIMARY KEY,
        nama_pemilik VARCHAR(100) NOT NULL,
        nama_hewan VARCHAR(100) NOT NULL,
        jenis_hewan VARCHAR(50),
        jenis_kelamin VARCHAR(10),
        umur INT,
        tipe_umur VARCHAR(20),
        anamnesa TEXT,
        terapi TEXT,
        dokter VARCHAR(100),
        tanggal_periksa DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database seed created successfully.');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to database:', error instanceof Error ? error.message : String(error));
    return false;
  }
};
