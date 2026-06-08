import { Router } from "express";
import {
  createUser,
  loginUser,
  verifyEmail,
} from "../controllers/user.controller";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
export default router;
