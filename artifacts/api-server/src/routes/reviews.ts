import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";

const router = Router();

router.get("/reviews", async (req, res) => {
  try {
    const reviews = await db.select().from(reviewsTable);
    res.json(reviews);
  } catch (err) {
    req.log.error({ err }, "Failed to list reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
