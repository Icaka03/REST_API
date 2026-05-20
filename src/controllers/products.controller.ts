import { Request, Response } from "express";

const products = [
  { id: 1, name: "TV", price: 44.99 },
  { id: 2, name: "PC", price: 200.99 },
];

export const getProducts = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: products,
  });
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({
      success: false,
      message: " Name and price are required",
    });
    return;
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newProduct);

  res.status(200).json({
    success: true,
    data: newProduct,
  });
};
