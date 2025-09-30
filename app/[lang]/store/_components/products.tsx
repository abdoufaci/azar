import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import { ArrowUpLeft } from "lucide-react";
import ProductCard from "./product-card";

export default function Products() {
  const products: Product[] = [
    {
      id: 1,
      name: "Florence",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 2,
      name: "Milano",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 3,
      name: "Roma",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 4,
      name: "Venice",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 5,
      name: "Napoli",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 6,
      name: "Torino",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 7,
      name: "Palermo",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
    {
      id: 8,
      name: "Bologna",
      image: "/product.png",
      price: "140 000 Da",
      startingFrom: "ابتداءً من",
    },
  ];

  return (
    <div className="max-md:!px-4 md:!w-[90%] container mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-2xl font-bold text-[#272727]">
          المنتجات الأكثر مبيعاً
        </h1>
        <p className="text-lg md:text-xl text-[#747474] max-w-4xl mx-auto leading-relaxed">
          اكتشف القطع التي أحبها عملاؤنا - تصاميم خالدة وجودة مضمونة
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center justify-center">
        <Button
          variant={"yellow_brand"}
          size={"lg"}
          className="rounded-full flex items-center gap-4 px-2 pr-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black">
            <ArrowUpLeft className="w-5 h-5" />
          </div>
          <span className="text-[#272727]">اكتشف المزيد</span>
        </Button>
      </div>
    </div>
  );
}
