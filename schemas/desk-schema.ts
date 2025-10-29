import {
  DemandPriority,
  DeskType,
  ProductCategory,
  StockDisponibility,
} from "@prisma/client";
import { z } from "zod";

export const deskFormSchema = z.object({
  type: z.enum([DeskType.DEPOSIT, DeskType.WITHDRAWAL]),
  name: z.string(),
  amount: z.number(),
});

export type DeskFormData = z.infer<typeof deskFormSchema>;
