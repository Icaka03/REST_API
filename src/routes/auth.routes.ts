import { Router } from "express";
import {
  createUser,
  loginUser,
  verifyEmail,
} from "../controllers/user.controller";
import { authLimiter } from "../middleware/rateLimiter.middleware";
const router = Router();

router.post("/register", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);
router.get("/verify-email", authLimiter, verifyEmail);
export default router;
