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

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name && !price) {
    res.status(400).json({
      success: false,
      message: "Provide at least a name or price to update",
    });
    return;
  }

  const currentProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!currentProduct) {
    res.status(400).json({
      success: false,
      message: "cannot find product",
    });
    return;
  }

  if (name || price) {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, price },
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const currentProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!currentProduct) {
    res.status(404).json({
      success: false,
      message: "not existing product",
    });
    return;
  }

  const product = await prisma.product.delete({
    where: { id: Number(id) },
  });

  res.status(200).json({
    success: true,
    message: "product deleted",
    data: product,
  });
};
