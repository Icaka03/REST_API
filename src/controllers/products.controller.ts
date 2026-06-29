import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { productScheme, productIdScheme } from "../schemas/products.schema";
import { error } from "node:console";
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = productScheme.safeParse(req.body);

    if (!results.success) {
      res.status(400).json({
        success: false,
        error: results.error.errors,
      });
      return;
    }
    const { name, price } = results.data;
    const product = await prisma.product.create({
      data: { name, price },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = productScheme.safeParse(req.body);
    const idParams = productIdScheme.safeParse(req.params);

    if (!results.success) {
      res.status(400).json({
        success: false,
        error: results.error.errors,
      });
      return;
    }

    if (!idParams.success) {
      res.status(400).json({
        success: false,
        error: idParams.error.errors,
      });
      return;
    }

    const { id } = idParams.data;
    const { name, price } = results.data;

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
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idParams = productIdScheme.safeParse(req.params);

    if (!idParams.success) {
      res.status(400).json({
        success: false,
        error: idParams.error.errors,
      });
      return;
    }

    const { id } = idParams.data;

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
  } catch (error) {
    next(error);
  }
};
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idParams = productIdScheme.safeParse(req.params);

    if (!idParams.success) {
      res.status(400).json({
        success: false,
        error: idParams.error.errors,
      });
      return;
    }

    const { id } = idParams.data;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      res.status(400).json({
        success: false,
        message: "not found item with this id",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
