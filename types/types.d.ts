import {
  ProductSubtype,
  User,
  WorkShop,
  ProductVariant,
  ProductPricing,
  Order,
  Tissu,
  OrderStage,
  OrderPricing,
  Product,
  Guest,
  Demand,
  DemandMaterial,
  DemandStage,
  OrderHistory,
  DemandHistory,
} from "@prisma/client";

export type DemandInTable = Demand & {
  material: DemandMaterial;
  workshop: WorkShop;
  stage: DemandStage;
  user: User;
  history: (DemandHistory & {
    user: User;
    newStage: DemandStage | null;
    oldStage: DemandStage | null;
  })[];
};

export type OrderWithRelations = Order & {
  client: User | null;
  tissu: Tissu | null;
  orderStage: OrderStage | null;
  pricing: OrderPricing | null;
  subType: ProductSubtype;
  cutter: User | null;
  tailor: User | null;
  tapisier: User | null;
  user: User | null;
  variant: ProductVariant;
  workShop: WorkShop | null;
  guest: Guest | null;
};

type OrderWithRelationsWithHistory = Order & {
  client: User | null;
  tissu: Tissu | null;
  orderStage: OrderStage | null;
  pricing: OrderPricing | null;
  subType: ProductSubtype;
  cutter: User | null;
  tailor: User | null;
  tapisier: User | null;
  user: User | null;
  variant: ProductVariant;
  workShop: WorkShop | null;
  guest: Guest | null;
  history: (OrderHistory & {
    employee: User | null;
    newStage: OrderStage | null;
    oldStage: OrderStage | null;
    user: User;
  })[];
};

export type ProductionInTable = OrderWithRelationsWithHistory & {
  subOrders: OrderWithRelationsWithHistory[];
  subOrder:
    | (OrderWithRelationsWithHistory & {
        subOrders: OrderWithRelationsWithHistory[];
      })
    | null;
};

export type OrderInTable = Order & {
  client: User | null;
  tissu: Tissu | null;
  subType: ProductSubtype;
  user: User | null;
  variant: ProductVariant;
  guest: Guest | null;
};

export type UserWithWorkshop = User & {
  workShop: WorkShop | null;
};

export type ProductVariantWithPricing = ProductVariant & {
  pricings: (ProductPricing & {
    subtype: ProductSubtype;
  })[];
};

export type ProductWithPricing = Product & {
  tissues: Tissu[];
  pricing: ProductPricing & {
    subtype: ProductSubtype;
    variant: ProductVariant;
  };
};
