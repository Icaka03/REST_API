import { z } from "zod";

export const userScheme = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginScheme = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
