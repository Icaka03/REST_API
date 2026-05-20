import { Router } from "express";
import { getUsers, getUserById } from "../controllers/user.controller";

const router = Router();

// GET /api/users
router.get("/", getUsers);

// GET /api/users/1
router.get("/:id", getUserById);

export default router;
