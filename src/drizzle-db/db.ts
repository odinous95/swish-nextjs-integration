// db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
export const sql = neon(`${process.env.DATABASE_URL}`);
