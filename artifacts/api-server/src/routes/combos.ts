import { Router } from "express";
import { db, combosTable, comboProductsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/combos", async (req, res) => {
  try {
    const combos = await db.select().from(combosTable);

    const comboProductRows = await db
      .select({ comboId: comboProductsTable.comboId, product: productsTable })
      .from(comboProductsTable)
      .leftJoin(productsTable, eq(comboProductsTable.productId, productsTable.id));

    const productsByCombo: Record<number, typeof productsTable.$inferSelect[]> = {};
    for (const row of comboProductRows) {
      if (!row.product) continue;
      if (!productsByCombo[row.comboId]) productsByCombo[row.comboId] = [];
      productsByCombo[row.comboId].push(row.product);
    }

    res.json(combos.map(c => ({
      ...c,
      comboPrice: parseFloat(c.comboPrice),
      originalPrice: c.originalPrice ? parseFloat(c.originalPrice) : undefined,
      products: (productsByCombo[c.id] || []).map(p => ({
        ...p,
        price: parseFloat(p.price),
        rating: p.rating ? parseFloat(p.rating) : null,
      })),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list combos");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
