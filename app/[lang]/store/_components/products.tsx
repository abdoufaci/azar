import { Button } from "@/components/ui/button";
import { ArrowUpLeft } from "lucide-react";
import ProductCard from "./product-card";
import Link from "next/link";
import { getStoreProducts } from "@/actions/queries/products/get-store-products";

export default async function Products() {
  const products = await getStoreProducts();

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
          <Link href={`/store/product/${product.id}`}>
            <ProductCard product={product} key={product.id} />
          </Link>
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
