import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service";
import { userScheme, loginScheme } from "../schemas/user.schema";

console.log("controller file loaded");
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = userScheme.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.errors,
      });
      return;
    }
    const { email, password, name } = result.data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const verificationCode = crypto.randomBytes(32).toString("hex");
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        verificationCode,
        verificationExpiresAt,
      },
    });

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = loginScheme.safeParse(req.body);

    if (!results.success) {
      res.status(400).json({
        success: false,
        error: results.error.errors,
      });
      return;
    }
    const { password, email } = req.body;

    const correctUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!correctUser) {
      res.status(400).json({
        success: false,
        message: "no user found",
      });
      return;
    }

    if (!correctUser.isVerified) {
      res.status(403).json({
        success: false,
        message: "user not verified",
      });
      return;
    }
    if (!correctUser.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses social login. Please sign in with Google or GitHub.",
      });
    }

    const samePassword = await bcrypt.compare(password, correctUser.password);

    if (samePassword) {
      const token = jwt.sign(
        // payload — what you store inside the token
        { id: correctUser.id, email: correctUser.email },
        // secret — used to sign and verify
        process.env.JWT_SECRET as string,
        // options
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { id: correctUser.id },
        process.env.REFRESH_SECRET as string,
        { expiresIn: "7d" },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS can't read it
        secure: false, // set true in production (requires HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      res.status(201).json({
        success: true,
        token,
        data: {
          email: correctUser.email,
          id: correctUser.id,
          createdAt: correctUser.createdAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.query;

    const user = await prisma.user.findUnique({
      where: { verificationCode: token as string },
    });

    // token not found
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // token expired
    if (
      !user.verificationExpiresAt ||
      user.verificationExpiresAt < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }

    // mark as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpiresAt: null,
      },
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};
