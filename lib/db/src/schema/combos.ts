import { pgTable, text, serial, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const combosTable = pgTable("combos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  comboPrice: numeric("combo_price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
});

export const comboProductsTable = pgTable("combo_products", {
  id: serial("id").primaryKey(),
  comboId: integer("combo_id").notNull().references(() => combosTable.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
});

export const insertComboSchema = createInsertSchema(combosTable).omit({ id: true });
export type InsertCombo = z.infer<typeof insertComboSchema>;
export type Combo = typeof combosTable.$inferSelect;
