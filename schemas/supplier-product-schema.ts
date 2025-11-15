import { StockDisponibility } from "@prisma/client";
import { z } from "zod";

export const supplierProductFormSchema = z.object({
  type: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export type SupplierProductFormData = z.infer<typeof supplierProductFormSchema>;
