import { pgTable, serial, text, varchar, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  src: text("src").notNull(),
  specs: text("specs").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  poster: text("poster").notNull(),
  videoUrl: text("video_url").notNull(),
  quote: text("quote").notNull(),
  couple: varchar("couple", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }).notNull(),
  price: varchar("price", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  recommended: boolean("recommended").default(false),
  cta: varchar("cta", { length: 100 }).notNull(),
  popular: boolean("popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  desc: text("desc").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  tag: varchar("tag", { length: 100 }).notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  partnerName: varchar("partner_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  service: varchar("service", { length: 255 }).notNull(),
  weddingDate: varchar("wedding_date", { length: 50 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  guestCount: varchar("guest_count", { length: 50 }),
  budget: varchar("budget", { length: 100 }).notNull(),
  message: text("message").notNull(),
  howFound: varchar("how_found", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  quote: text("quote").notNull(),
  message: text("message").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Since About, Contact, and Admin profile are basically single-record tables or simple configs,
// we can use a generic key-value settings table or dedicated single-row tables.
export const settings = pgTable("settings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  adminId: integer("admin_id").references(() => admins.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
