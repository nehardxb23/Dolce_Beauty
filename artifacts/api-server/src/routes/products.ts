import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ListProductsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.safeParse(req.query);
    let conditions: ReturnType<typeof eq>[] = [];

    if (query.success) {
      if (query.data.category) {
        conditions.push(eq(productsTable.category, query.data.category));
      }
      if (query.data.featured !== undefined) {
        conditions.push(eq(productsTable.isFeatured, query.data.featured));
      }
    }

    const products = conditions.length > 0
      ? await db.select().from(productsTable).where(and(...conditions))
      : await db.select().from(productsTable);

    res.json(products.map(p => ({
      ...p,
      price: parseFloat(p.price),
      rating: p.rating ? parseFloat(p.rating) : undefined,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/bestsellers", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.isBestseller, true));
    res.json(products.map(p => ({
      ...p,
      price: parseFloat(p.price),
      rating: p.rating ? parseFloat(p.rating) : undefined,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get bestsellers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({
      ...product,
      price: parseFloat(product.price),
      rating: product.rating ? parseFloat(product.rating) : undefined,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
