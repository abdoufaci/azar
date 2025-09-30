import { Product } from "@/types/types";
import Link from "next/link";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  return (
    <Link href={`/store/product/${product.id}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={`Furniture product ${product.id}`}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-black text-lg font-semibold">{product.name}</h3>
          <div className="text-right">
            <p className="text-[#747474] text-sm mb-1 font-medium">
              {product.startingFrom}
            </p>
            <p className="text-[#f2ba05] text-lg font-bold">{product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
