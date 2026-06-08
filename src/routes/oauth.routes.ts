import { Router } from "express";
import passport from "../config/passport";
import jwt from "jsonwebtoken";

const router = Router();

// ── Google ──────────────────────────────────────────
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as any).id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    // redirect to your frontend with the token
    res.redirect(`http://localhost:5173?token=${token}`);
  },
);

// ── GitHub ──────────────────────────────────────────
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as any).id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    res.redirect(`http://localhost:5173?token=${token}`);
  },
);

export default router;
