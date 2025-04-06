import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

const caPath = path.resolve(__dirname, './certs/ca.pem');

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    url: process.env.DATABASE_URL!,
    ssl: {
      rejectUnauthorized: false,
      // ca: fs.readFileSync(caPath).toString(),
    },
  },
});
