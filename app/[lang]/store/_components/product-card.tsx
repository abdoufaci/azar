"use client";

import { manageProductArchive } from "@/actions/mutations/products/manage-product-archive";
import { Product } from "@prisma/client";
import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  product: Product;
  isAdmin?: boolean;
  dict?: any;
  lang?: any;
  deleteProductOptimistic?: (id: string) => void;
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<InfiniteData<any, unknown>, Error>>;
}

function ProductCard({
  product,
  isAdmin,
  dict,
  lang,
  deleteProductOptimistic,
  refetch,
}: Props) {
  const [isPending, startTransition] = useTransition();

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
        {/* <div className="text-right">
          {!isAdmin && (
            <p className="text-[#747474] text-sm mb-1 font-medium">
              {dict?.products?.starting || "ابتداءا من"}
            </p>
          )}
        </div> */}
        {isAdmin && (
          <svg
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteProductOptimistic?.(product.id);
              toast.info(product.isArchived ? "Restauré !" : "Archivé !");
              startTransition(() => {
                manageProductArchive({
                  id: product.id,
                  isArchived: !product.isArchived,
                }).catch(() => {
                  toast.error("Erreur .");
                  refetch?.();
                });
              });
            }}
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {product.isArchived ? (
              <path
                d="M7.5 12.5L10.8333 9.16667L9.66666 8L8.33333 9.33333V5.83334H6.66666V9.33333L5.33333 8L4.16666 9.16667L7.5 12.5ZM1.66667 15C1.20833 15 0.816111 14.8369 0.49 14.5108C0.163889 14.1847 0.000555555 13.7922 0 13.3333V2.9375C0 2.74306 0.0313888 2.55556 0.0941665 2.375C0.156944 2.19445 0.250555 2.02778 0.375 1.875L1.41667 0.604171C1.56944 0.409726 1.76028 0.260282 1.98917 0.155838C2.21805 0.0513933 2.45778 -0.000551146 2.70833 4.40917e-06H12.2917C12.5417 4.40917e-06 12.7814 0.0522266 13.0108 0.156671C13.2403 0.261115 13.4311 0.410282 13.5833 0.604171L14.625 1.875C14.75 2.02778 14.8439 2.19445 14.9067 2.375C14.9694 2.55556 15.0005 2.74306 15 2.9375V13.3333C15 13.7917 14.8369 14.1842 14.5108 14.5108C14.1847 14.8375 13.7922 15.0006 13.3333 15H1.66667ZM2 2.5H13L12.2917 1.66667H2.70833L2 2.5Z"
                fill="#1E78FF"
              />
            ) : (
              <path
                d="M7.5 12.5L10.8333 9.16667L9.66666 8L8.33333 9.33333V5.83334H6.66666V9.33333L5.33333 8L4.16666 9.16667L7.5 12.5ZM1.66667 4.16667V13.3333H13.3333V4.16667H1.66667ZM1.66667 15C1.20833 15 0.816111 14.8369 0.49 14.5108C0.163889 14.1847 0.000555555 13.7922 0 13.3333V2.9375C0 2.74306 0.0313888 2.55556 0.0941665 2.375C0.156944 2.19445 0.250555 2.02778 0.375 1.875L1.41667 0.604171C1.56944 0.409726 1.76028 0.260282 1.98917 0.155838C2.21805 0.0513933 2.45778 -0.000551146 2.70833 4.40917e-06H12.2917C12.5417 4.40917e-06 12.7814 0.0522266 13.0108 0.156671C13.2403 0.261115 13.4311 0.410282 13.5833 0.604171L14.625 1.875C14.75 2.02778 14.8439 2.19445 14.9067 2.375C14.9694 2.55556 15.0005 2.74306 15 2.9375V13.3333C15 13.7917 14.8369 14.1842 14.5108 14.5108C14.1847 14.8375 13.7922 15.0006 13.3333 15H1.66667ZM2 2.5H13L12.2917 1.66667H2.70833L2 2.5Z"
                fill="#95A1B1"
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
