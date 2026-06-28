import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ success: false, message: "No refresh token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET as string) as {
      id: number;
    };

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    res.status(200).json({ token: newAccessToken });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};
