import { DemandPriority, ProductCategory } from "@prisma/client";
import { z } from "zod";

export const demandFormSchema = z.object({
  material: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  priority: z.enum([
    DemandPriority.NORMAL,
    DemandPriority.URGENT,
    DemandPriority.WEAK,
  ]),
  workShopId: z.string(),
  demand: z.string(),
});

export type DemandFormData = z.infer<typeof demandFormSchema>;
