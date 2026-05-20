import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductsId,
} from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductsId);
export default router;
