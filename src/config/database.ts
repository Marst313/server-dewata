import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export the drizzle instance
export const db = drizzle(pool);

// Export a function to test the connection
export const testConnection = async () => {
  try {
    await pool.connect();
    console.log('✅ Database connection established successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to database:', error instanceof Error ? error.message : String(error));
    return false;
  }
};
