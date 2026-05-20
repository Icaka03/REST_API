import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();

  res.status(200).json({
    success: true,
    data: products,
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({
      success: false,
      message: "Name and price are required",
    });
    return;
  }

  const product = await prisma.product.create({
    data: { name, price },
  });

  res.status(201).json({
    success: true,
    data: product,
  });
};
