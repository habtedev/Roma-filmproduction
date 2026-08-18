import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { admins } from "./db/schema";
import path from "path";

// Load .env explicitly since this is a separate script
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

async function seedAdmin() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No DATABASE_URL provided");
    process.exit(1);
  }

  const sql = postgres(connectionString);
  const db = drizzle(sql);

  console.log("Checking for admin user...");
  try {
    const existingAdmins = await db.select().from(admins).limit(1);
    
    if (existingAdmins.length === 0) {
      console.log("No admins found. Creating default admin...");
      const passwordHash = await bcrypt.hash("password123", 10);
      
      await db.insert(admins).values({
        email: "admin@romafilm.com",
        passwordHash,
      });
      console.log("Default admin created successfully! (admin@romafilm.com / password123)");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await sql.end();
  }
}

seedAdmin();
