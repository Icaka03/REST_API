import { Router } from "express";
import {
  createUser,
  loginUser,
  verifyEmail,
} from "../controllers/user.controller";
import { refreshToken } from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimiter.middleware";
const router = Router();
console.log("auth router loaded");
router.post("/register", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);
router.get("/verify-email", authLimiter, verifyEmail);
router.post("/refresh", refreshToken);
export default router;
