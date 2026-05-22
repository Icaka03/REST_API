import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
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
      message: "user allready exist",
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashPassword },
  });

  res.status(201).json({
    succes: true,
    data: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
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

  const samePassword = await bcrypt.compare(password, correctUser.password);

  if (samePassword) {
    res.status(201).json({
      success: true,
      data: {
        email: correctUser.email,
        id: correctUser.id,
        createdAt: correctUser.createdAt,
      },
    });
  }
};
