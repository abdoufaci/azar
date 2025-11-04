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
  OrderColumnCell,
  OrderColumnStatus,
  Stock,
  StockType,
  Invoice,
} from "@prisma/client";

export type StockInTable = Stock & {
  workshop: WorkShop;
  type: StockType;
};

export type UserInTable = User & {
  invoices: Invoice[];
  workShop: WorkShop | null;
  cutterOrders: (Order & {
    variant: ProductVariant | null;
    subType: ProductSubtype | null;
    pricing: OrderPricing | null;
  })[];
  tailorOrders: (Order & {
    variant: ProductVariant | null;
    subType: ProductSubtype | null;
    pricing: OrderPricing | null;
  })[];
  tapisierOrders: (Order & {
    variant: ProductVariant | null;
    subType: ProductSubtype | null;
    pricing: OrderPricing | null;
  })[];
  mancheurOrders: (Order & {
    variant: ProductVariant | null;
    subType: ProductSubtype | null;
    pricing: OrderPricing | null;
  })[];
};

export type DemandInTable = Demand & {
  material: DemandMaterial;
  workshop: WorkShop;
  stage: DemandStage;
  user: User;
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

type OrderWithRelationsWithCells = Order & {
  client: User | null;
  tissu: Tissu | null;
  orderStage: OrderStage | null;
  pricing: OrderPricing | null;
  subType: ProductSubtype;
  cutter: User | null;
  tailor: User | null;
  tapisier: User | null;
  mancheur: User | null;
  user: User | null;
  variant: ProductVariant;
  workShop: WorkShop | null;
  guest: Guest | null;
  extraCells: (OrderColumnCell & {
    person: User | null;
    status: OrderColumnStatus | null;
  })[];
};

export type ProductionInTable = Order & {
  client: User | null;
  tissu: Tissu | null;
  orderStage: OrderStage | null;
  pricing: OrderPricing | null;
  subType: ProductSubtype;
  cutter: User | null;
  tailor: User | null;
  tapisier: User | null;
  mancheur: User | null;
  user: User | null;
  variant: ProductVariant;
  workShop: WorkShop | null;
  guest: Guest | null;
  extraCells: (OrderColumnCell & {
    person: User | null;
    status: OrderColumnStatus | null;
  })[];
};

export type OrderInTable = Order & {
  client: User | null;
  tissu: Tissu | null;
  subType: ProductSubtype;
  user: User | null;
  variant: ProductVariant;
  guest: Guest | null;
  orderStage: OrderStage | null;
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
