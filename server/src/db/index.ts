import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../config/.env') });

const connectionString = process.env.DATABASE_URL;

// Prevent errors if URL is not set yet (for type checking and initial setup)
const client = postgres(connectionString || 'postgres://postgres:postgres@localhost:5432/roma', { prepare: false });

export const db = drizzle(client, { schema });
