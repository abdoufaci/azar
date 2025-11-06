"use client";

import { Cart, CartItem, Product, ProductPricing, Tissu } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

export const useCartQuery = () => {
  const cartId =
    typeof window !== "undefined" ? localStorage.getItem("cart_Id") : null;

  const fetchCart = async () => {
    const url = qs.stringifyUrl(
      {
        url: "/api/cart",
        query: {
          cartId,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);
    return res.json();
  };

  const { data, refetch, isPending } = useQuery({
    queryFn: fetchCart,
    queryKey: ["cart", cartId],
  });

  return {
    data: data?.cart as Cart & {
      items: (CartItem & {
        product: Product;
        tissu: Tissu;
      })[];
    },
    refetch,
    isPending,
  };
};
