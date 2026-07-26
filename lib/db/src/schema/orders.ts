import { pgTable, serial, varchar, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull(),
  status: varchar("status").notNull().default("confirmed"),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  address: varchar("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
