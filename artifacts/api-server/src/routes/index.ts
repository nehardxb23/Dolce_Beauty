import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import combosRouter from "./combos";
import cartRouter from "./cart";
import reviewsRouter from "./reviews";
import aiMatchRouter from "./ai-match";
import authRouter from "./auth";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(combosRouter);
router.use(cartRouter);
router.use(reviewsRouter);
router.use(aiMatchRouter);
router.use(authRouter);
router.use(ordersRouter);

export default router;
