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
