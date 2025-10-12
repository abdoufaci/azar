"use client";

import { ShoppingCart, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Product,
  ProductPricing,
  ProductSubtype,
  ProductVariant,
  Tissu,
} from "@prisma/client";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { ProductWithPricing } from "@/types/types";
import { manageCart } from "@/actions/mutations/cart/manage-cart";
import { toast } from "sonner";
import { useCartQuery } from "@/hooks/use-cart-query";
import { useModal } from "@/hooks/use-modal-store";

interface Props {
  product: ProductWithPricing | null;
  tissues: Tissu[];
}

function ProductDetails({ product, tissues }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const cartId = localStorage.getItem("cart_Id");
  const [isPending, startTransition] = useTransition();
  const { refetch } = useCartQuery();
  const { onOpen } = useModal();

  const images = (product?.images as { id: string; type: string }[]).map(
    (image) =>
      `https://${process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME}/${image?.id}`
  );
  const sanitizedDescription = DOMPurify.sanitize(
    //@ts-ignore
    product?.arDescription
  );
  const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitizedDescription;

  const descriptionText = tempDiv.textContent || tempDiv.innerText || "";

  const onAddProduct = () => {
    if (!product) return;
    startTransition(() => {
      manageCart({
        product,
        cartId,
      })
        .then((res) => {
          if (res.status === "guest_cart_created" && !!res?.cart) {
            localStorage.setItem("cart_Id", res.cart.id);
          }
          refetch();
          toast.success("Produit ajouter !");
        })
        .catch(() => toast.error("Erreur"));
    });
  };

  return (
    <div className="min-h-screen mt-32 bg-[#ffffff] w-full md:!w-[90%] mx-auto">
      {/* Breadcrumb */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#f5f5f5]">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt="كومفورتو ثلاثية"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-[#f2ba05]"
                      : "border-transparent hover:border-[#f2ba05]"
                  }`}>
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`صورة ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            <nav className="container mx-auto py-4">
              <div className="flex items-center justify-end gap-2 text-sm text-[#767676]">
                <span>
                  {product?.pricing.variant.category === "SALON"
                    ? "صالون"
                    : product?.pricing.variant.category === "CHAIR"
                    ? "كراسي"
                    : "طاولات"}{" "}
                  / {product?.arName}{" "}
                </span>
                <ArrowRight
                  onClick={() => router.back()}
                  className="h-6 w-6 cursor-pointer"
                />
              </div>
            </nav>
            {/* Title */}
            <h1 className="text-6xl text-right text-[#17183B]">
              {product?.arName}
            </h1>

            {/* Price */}
            <div className="text-5xl font-bold text-[#f2ba05] text-right">
              {product?.price}
            </div>

            {/* Description */}
            <div
              dir="rtl"
              className={cn(
                "text-[#272626] text-lg whitespace-break-spaces [&_ol]:list-decimal [&_ul]:list-disc",
                isArabic(descriptionText) && "rtl"
              )}
              dangerouslySetInnerHTML={{
                //@ts-ignore
                __html: sanitizedDescription,
              }}></div>

            {/* Add to Cart Button */}
            <div className="flex items-center justify-end">
              <Button
                disabled={isPending}
                onClick={() =>
                  product?.audience === "B2B"
                    ? onOpen("chooseTissu", { product, tissues })
                    : onAddProduct()
                }
                variant={"yellow_brand"}
                size="lg"
                className="text-[#212121] p-4 rounded-[10px] px-10 font-medium flex items-center gap-7 text-lg h-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.54866 18.7499C9.48809 18.7499 10.2497 17.9883 10.2497 17.0489C10.2497 16.1095 9.48809 15.3479 8.54866 15.3479C7.60922 15.3479 6.84766 16.1095 6.84766 17.0489C6.84766 17.9883 7.60922 18.7499 8.54866 18.7499Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.9598 18.7499C16.8992 18.7499 17.6608 17.9883 17.6608 17.0489C17.6608 16.1095 16.8992 15.3479 15.9598 15.3479C15.0204 15.3479 14.2588 16.1095 14.2588 17.0489C14.2588 17.9883 15.0204 18.7499 15.9598 18.7499Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.606 3.555L6.616 9.919C6.925 10.897 7.079 11.386 7.376 11.748C7.636 12.068 7.975 12.315 8.358 12.468C8.793 12.641 9.305 12.641 10.331 12.641H14.186C15.212 12.641 15.724 12.641 16.158 12.468C16.542 12.315 16.88 12.068 17.141 11.748C17.437 11.386 17.591 10.897 17.901 9.919L18.31 8.623L18.55 7.857L18.881 6.807C18.9991 6.4325 19.0274 6.03544 18.9634 5.648C18.8995 5.26055 18.7452 4.89361 18.513 4.57691C18.2809 4.26021 17.9774 4.00266 17.6271 3.82511C17.2768 3.64757 16.8897 3.55503 16.497 3.555H4.606ZM4.606 3.555L4.595 3.518C4.55277 3.37656 4.50608 3.23649 4.455 3.098C4.25255 2.58554 3.90923 2.14082 3.46473 1.81523C3.02022 1.48963 2.49266 1.29645 1.943 1.258C1.84 1.25 1.727 1.25 1.5 1.25"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h3>اضف الى السلة</h3>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
