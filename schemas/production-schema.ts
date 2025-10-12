import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const productionFormSchema = z.object({
  category: z.enum([
    ProductCategory.SALON,
    ProductCategory.TABLE,
    ProductCategory.CHAIR,
  ]),
  variant: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  tissu: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  subtypeId: z.string(),
  clientId: z.string().optional(),
  workShopId: z.string(),
  price: z.number(),
  note: z.string().optional(),
});

export type ProductionFormData = z.infer<typeof productionFormSchema>;
