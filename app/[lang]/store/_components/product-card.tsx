import { Product } from "@prisma/client";
import Link from "next/link";

interface Props {
  product: Product;
  isAdmin?: boolean;
  dict?: any;
  lang?: any;
}

function ProductCard({ product, isAdmin, dict, lang }: Props) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${
            (product.images as { type: string; id: string }[])[
              product.mainImageIdx
            ].id
          }`}
          alt={`Furniture product ${product.id}`}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-center">
        <h3 className="text-black text-lg font-medium">
          {lang === "ar" ? product.arName : product.frName}
        </h3>
        <div className="text-right">
          {!isAdmin && (
            <p className="text-[#747474] text-sm mb-1 font-medium">
              {dict?.products?.starting || "ابتداءا من"}
            </p>
          )}
          <p className="text-[#f2ba05] text-lg font-medium">{product.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
