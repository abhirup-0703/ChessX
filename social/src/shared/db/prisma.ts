import 'dotenv/config'; // Double safety check
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in the .env file!");
}

// Initialize the pool with explicit SSL settings for Neon
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Neon and many cloud DBs
  }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });