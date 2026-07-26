import { Router } from "express";
import { db, cartItemsTable, productsTable, combosTable } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { AddToCartBody, RemoveFromCartParams, AddComboToCartBody } from "@workspace/api-zod";

const router = Router();

const DEFAULT_SESSION = "default-session";

async function buildCartResponse(sessionId: string) {
  const rows = await db
    .select()
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const cartItems = rows.map(row => {
    const isCombo = row.cart_items.comboId !== null;
    if (isCombo) {
      return {
        id: row.cart_items.id,
        quantity: row.cart_items.quantity,
        comboId: row.cart_items.comboId,
        comboName: row.cart_items.comboName,
        comboPrice: row.cart_items.comboPrice ? parseFloat(row.cart_items.comboPrice) : 0,
        productId: null,
        product: null,
      };
    }
    if (!row.products) return null;
    return {
      id: row.cart_items.id,
      quantity: row.cart_items.quantity,
      productId: row.cart_items.productId,
      product: {
        ...row.products,
        price: parseFloat(row.products.price),
        rating: row.products.rating ? parseFloat(row.products.rating) : null,
      },
      comboId: null,
      comboName: null,
      comboPrice: null,
    };
  }).filter(Boolean) as NonNullable<ReturnType<typeof rows[number] extends any ? any : never>>[];

  const total = cartItems.reduce((sum, item) => {
    if (item.comboId !== null) return sum + item.comboPrice * item.quantity;
    return sum + item.product.price * item.quantity;
  }, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: cartItems, total, itemCount };
}

router.get("/cart", async (req, res) => {
  try {
    const cart = await buildCartResponse(DEFAULT_SESSION);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart/combo", async (req, res) => {
  try {
    const body = AddComboToCartBody.parse(req.body);

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(and(
        eq(cartItemsTable.sessionId, DEFAULT_SESSION),
        eq(cartItemsTable.comboId, body.comboId)
      ));

    if (existing) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing.quantity + 1 })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({
        sessionId: DEFAULT_SESSION,
        comboId: body.comboId,
        comboName: body.comboName,
        comboPrice: String(body.comboPrice),
        quantity: 1,
      });
    }

    const cart = await buildCartResponse(DEFAULT_SESSION);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to add combo to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const body = AddToCartBody.parse(req.body);
    const productId = body.productId;
    const quantity = body.quantity ?? 1;

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(and(
        eq(cartItemsTable.sessionId, DEFAULT_SESSION),
        eq(cartItemsTable.productId, productId)
      ));

    if (existing) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({
        sessionId: DEFAULT_SESSION,
        productId,
        quantity,
      });
    }

    const cart = await buildCartResponse(DEFAULT_SESSION);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart", async (req, res) => {
  try {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, DEFAULT_SESSION));
    res.json({ items: [], total: 0, itemCount: 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to clear cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const parsed = RemoveFromCartParams.safeParse({ itemId: req.params.itemId });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid item ID" });
      return;
    }
    await db.delete(cartItemsTable).where(and(
      eq(cartItemsTable.id, parsed.data.itemId),
      eq(cartItemsTable.sessionId, DEFAULT_SESSION)
    ));
    const cart = await buildCartResponse(DEFAULT_SESSION);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
