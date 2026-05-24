import { Router } from "express";
import { getProducts, createProduct } from "../controllers/products.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router();

router.get("/", getProducts);
router.post("/", verifyToken, createProduct);

export default router;
