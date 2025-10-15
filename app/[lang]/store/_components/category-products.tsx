import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import { Product } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  title: string;

  dict: any;
  lang: any;
}

function CategoryProducts({ products, title, dict, lang }: Props) {
  return (
    <div className="max-md:!px-4 md:!w-[90%] mx-auto space-y-10">
      <div
        className={cn(
          "flex items-center justify-between",
          lang === "ar" ? "" : "flex-row-reverse"
        )}>
        <Button
          variant={"blackOutline"}
          size={"lg"}
          className="rounded-full py-1.5 h-fit">
          {dict.all.seeMoreButton}
        </Button>
        <h1 className="text-[#272727] font-bold text-lg">{title}</h1>
      </div>
      <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <Link key={product.id} href={`/store/product/${product.id}`}>
            <ProductCard product={product} dict={dict} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
