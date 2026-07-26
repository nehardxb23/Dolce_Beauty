import { pgTable, serial, integer, text, numeric } from "drizzle-orm/pg-core";
import { productsTable } from "./products";
import { combosTable } from "./combos";

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").references(() => productsTable.id),
  comboId: integer("combo_id").references(() => combosTable.id),
  comboName: text("combo_name"),
  comboPrice: numeric("combo_price", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull().default(1),
});

export type CartItem = typeof cartItemsTable.$inferSelect;
