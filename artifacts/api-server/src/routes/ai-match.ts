import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetAiMatchBody } from "@workspace/api-zod";

const router = Router();

router.post("/ai-match", async (req, res) => {
  try {
    const body = GetAiMatchBody.parse(req.body);
    const { skinTone, occasion } = body;

    let products = await db.select().from(productsTable);

    if (skinTone) {
      const toneFiltered = products.filter(p =>
        !p.skinTone || p.skinTone.toLowerCase() === skinTone.toLowerCase()
      );
      if (toneFiltered.length > 0) products = toneFiltered;
    }

    const recommended = products.slice(0, 4).map(p => ({
      ...p,
      price: parseFloat(p.price),
      rating: p.rating ? parseFloat(p.rating) : undefined,
    }));

    res.json(recommended);
  } catch (err) {
    req.log.error({ err }, "Failed to get AI match");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
