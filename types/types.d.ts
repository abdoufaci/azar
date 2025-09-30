import { User, WorkShop } from "@prisma/client";

export interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  startingFrom: string;
}

export type UserWithWorkshop = User & {
  workShop: WorkShop | null;
};
