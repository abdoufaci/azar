import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import ProductCard from "./product-card";

interface Props {
  products: Product[];
  title: string;
}

function CategoryProducts({ products, title }: Props) {
  return (
    <div className="max-md:!px-4 md:!w-[90%] mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <Button
          variant={"blackOutline"}
          size={"lg"}
          className="rounded-full py-1.5 h-fit">
          المزيد
        </Button>
        <h1 className="text-[#272727] font-bold text-lg">{title}</h1>
      </div>
      <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
