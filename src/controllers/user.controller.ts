import { Request, Response } from "express";

// hardcoded data for now
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
];

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: users,
  });
};

export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};
