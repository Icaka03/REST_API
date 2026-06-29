import { z } from "zod";

export const productScheme = z.object({
  name: z.string(),
  price: z.coerce.number(),
});

export const productIdScheme = z.object({
  id: z.coerce.number(),
});
