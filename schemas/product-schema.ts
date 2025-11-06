import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const productFormSchema = z.object({
  category: z.enum([
    ProductCategory.SALON,
    ProductCategory.TABLE,
    ProductCategory.CHAIR,
  ]),
  images: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
      })
    )
    .min(1),
  variant: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  tissues: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  language: z.string(),
  nameFr: z.string(),
  nameAr: z.string(),
  descriptionFr: z.string(),
  descriptionAr: z.string(),
  mainImageIdx: z.number(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
