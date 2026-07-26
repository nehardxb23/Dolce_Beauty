import { Router, type IRouter, type Request, type Response } from "express";
import { db, cartItemsTable, productsTable, ordersTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { PlaceOrderBody } from "@workspace/api-zod";

const router: IRouter = Router();

const DEFAULT_SESSION = "default-session";

// GET /orders – list orders for the current authenticated user
router.get("/orders", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.json([]);
    return;
  }

  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, req.user.id))
      .orderBy(sql`${ordersTable.createdAt} desc`);

    res.json(
      orders.map((o) => ({
        ...o,
        total: parseFloat(o.total),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders – place order from current cart, award loyalty points
router.post("/orders", async (req: Request, res: Response) => {
  const parsed = PlaceOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { firstName, lastName, email, address } = parsed.data;

  try {
    // 1. Fetch current cart
    const cartRows = await db
      .select()
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .where(eq(cartItemsTable.sessionId, DEFAULT_SESSION));

    if (cartRows.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    // 2. Build order items snapshot & compute subtotal
    let subtotal = 0;
    const orderItems: { name: string; price: number; quantity: number; comboName: string | null }[] = [];

    for (const row of cartRows) {
      const item = row.cart_items;
      if (item.comboId) {
        const price = item.comboPrice ? parseFloat(item.comboPrice) : 0;
        orderItems.push({ name: item.comboName ?? "Combo Kit", price, quantity: item.quantity, comboName: item.comboName });
        subtotal += price * item.quantity;
      } else if (row.products) {
        const price = parseFloat(row.products.price);
        orderItems.push({ name: row.products.name, price, quantity: item.quantity, comboName: null });
        subtotal += price * item.quantity;
      }
    }

    const total = subtotal * 1.08; // include 8% tax

    // 3. Persist order
    const [order] = await db
      .insert(ordersTable)
      .values({
        userId: req.isAuthenticated() ? req.user.id : null,
        total: total.toFixed(2),
        items: orderItems,
        firstName,
        lastName,
        email,
        address: address ?? null,
        status: "confirmed",
      })
      .returning();

    // 4. Award loyalty points to authenticated users (tiered by order total)
    if (req.isAuthenticated()) {
      const pointsToAward =
        total >= 100 ? 90 :
        total >= 80  ? 70 :
        total >= 50  ? 60 :
        total >= 30  ? 45 :
        total >= 18  ? 30 :
        total >= 10  ? 15 : 0;
      await db
        .update(usersTable)
        .set({ loyaltyPoints: sql`${usersTable.loyaltyPoints} + ${pointsToAward}` })
        .where(eq(usersTable.id, req.user.id));
    }

    // 5. Clear cart
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, DEFAULT_SESSION));

    res.json({ ...order, total: parseFloat(order.total) });
  } catch (err) {
    req.log.error({ err }, "Failed to place order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
