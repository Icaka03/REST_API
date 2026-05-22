import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
} from "../controllers/user.controller";

const router = Router();

// GET /api/users
router.get("/", getUsers);

router.post("/", createUser);
router.get("/login", loginUser);
export default router;
