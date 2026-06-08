import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service";
export const getUsers = async (req: Request, res: Response) => {
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
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
      return;
    }

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
    console.error("createUser error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
  const samePassword = await bcrypt.compare(password, correctUser.password);

  const token = jwt.sign(
    // payload — what you store inside the token
    { id: correctUser.id, email: correctUser.email },
    // secret — used to sign and verify
    process.env.JWT_SECRET as string,
    // options
    { expiresIn: "15m" },
  );

  if (samePassword) {
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
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  const user = await prisma.user.findUnique({
    where: { verificationCode: token as string },
  });

  // token not found
  if (!user) {
    return res.status(400).json({ message: "Invalid verification token" });
  }

  // token expired
  if (!user.verificationExpiresAt || user.verificationExpiresAt < new Date()) {
    return res.status(400).json({ message: "Verification token has expired" });
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
};
