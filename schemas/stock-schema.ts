import {
  DemandPriority,
  ProductCategory,
  StockDisponibility,
} from "@prisma/client";
import { z } from "zod";

export const stockFormSchema = z.object({
  type: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  disponibility: z.enum([
    StockDisponibility.IN_STOCK,
    StockDisponibility.OUT_OF_STOCK,
    StockDisponibility.LIMITED,
  ]),
  warehouse: z.object({
    id: z.string(),
    name: z.string(),
  }),
  name: z.string(),
  quantity: z.number(),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
