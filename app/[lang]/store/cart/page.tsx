"use client";

import { addOrder } from "@/actions/mutations/cart/add-order";
import { removeCartItem } from "@/actions/mutations/cart/remove-cart-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartQuery } from "@/hooks/use-cart-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function CartPage() {
  const [name, setName] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [note, setNote] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [isRemoving, startRemoveTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModal();
  const user = useCurrentUser();

  const { data: cart, refetch } = useCartQuery();

  const total = cart?.items?.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <div className="w-[90%] mx-auto flex flex-wrap items-start justify-center gap-14 bg-[#FAFAFA] pt-20">
      <div
        dir="rtl"
        className={cn(
          "bg-white w-full shadow-sm space-y-5 p-4",
          !!user ? "" : "max-w-xl"
        )}>
        <h1 className="text-xl text-[#1D1D1F] font-medium">السلة</h1>
        <ScrollArea
          dir="rtl"
          className={cn(cart?.items?.length > 2 ? "h-64" : "h-56")}>
          <div className="space-y-5">
            {cart?.items?.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <Image
                    alt="product"
                    src={`https://${
                      process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME
                    }/${
                      (item.product.images as { type: string; id: string }[])[
                        item.product.mainImageIdx
                      ].id
                    }`}
                    height={250}
                    width={250}
                  />
                  <div className="space-y-2">
                    <h3 className="text-[#17183B]">{item.product.arName}</h3>
                    <h5 className="text-[#46464A]">
                      القماش : {item.tissu.name}{" "}
                    </h5>
                  </div>
                </div>
                <div
                  onClick={() => {
                    if (!isRemoving) {
                      startRemoveTransition(() => {
                        toast.loading("en cour...", { id: "loading" });
                        removeCartItem({
                          itemId: item.id,
                        })
                          .then(() => {
                            toast.success("Success !");
                            refetch();
                          })
                          .catch(() => toast.error("Erreur ."))
                          .finally(() => toast.dismiss("loading"));
                      });
                    }
                  }}
                  className="h-7 w-7 rounded-full border border-[#0000005C] text-[#0000005C] flex items-center justify-center cursor-pointer">
                  <XIcon className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="w-full" />
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-[#1D1D1F] font-medium text-xl">المجموع</h1>
          <h3 dir="ltr" className="text-[#1D1D1F] font-medium text-xl">
            {total} DA
          </h3>
        </div>
        {(!isEdit || !!user) && (
          <Button
            disabled={isPending}
            onClick={() => {
              startTransition(() => {
                toast.loading("en cour...", { id: "loading" });
                addOrder({
                  cart,
                  guest: {
                    name,
                    adress,
                    note,
                    phone,
                    wilaya,
                  },
                })
                  .then(() => {
                    toast.success("Success");
                    onOpen("thankyou");
                    refetch();
                  })
                  .catch(() => toast.error("Erreur ."))
                  .finally(() => toast.dismiss("loading"));
              });
            }}
            variant={"yellow_brand"}
            size={"lg"}
            className="w-full">
            الدفع
          </Button>
        )}
        <div className="flex items-center justify-center gap-4">
          <svg
            width="25"
            height="19"
            viewBox="0 0 25 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.06738 8.48307L4.25285 4.90042C4.67872 4.42116 5.20129 4.03756 5.78614 3.77486C6.37098 3.51217 7.00485 3.37635 7.64598 3.37634H7.87635M1.06738 18.1291H7.30894L11.8483 14.7246C11.8483 14.7246 12.7675 14.1039 14.1179 13.0224C16.955 10.7527 14.1179 7.15986 11.2808 9.05048C8.97033 10.5904 6.74152 11.8876 6.74152 11.8876"
              stroke="#1D1D1F"
              stroke-width="1.70224"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.87598 11.3201V3.94373C7.87598 3.34178 8.1151 2.76448 8.54074 2.33884C8.96639 1.9132 9.54368 1.67407 10.1456 1.67407H21.4939C22.0959 1.67407 22.6732 1.9132 23.0988 2.33884C23.5244 2.76448 23.7636 3.34178 23.7636 3.94373V10.7527C23.7636 11.3546 23.5244 11.9319 23.0988 12.3576C22.6732 12.7832 22.0959 13.0224 21.4939 13.0224H14.1175"
              stroke="#1D1D1F"
              stroke-width="1.70224"
            />
            <path
              d="M20.9263 7.35956L20.9377 7.34707M10.7129 7.35956L10.7242 7.34707M15.8196 9.61787C15.2177 9.61787 14.6404 9.37874 14.2147 8.9531C13.7891 8.52745 13.55 7.95016 13.55 7.34821C13.55 6.74626 13.7891 6.16896 14.2147 5.74332C14.6404 5.31768 15.2177 5.07855 15.8196 5.07855C16.4216 5.07855 16.9989 5.31768 17.4245 5.74332C17.8502 6.16896 18.0893 6.74626 18.0893 7.34821C18.0893 7.95016 17.8502 8.52745 17.4245 8.9531C16.9989 9.37874 16.4216 9.61787 15.8196 9.61787Z"
              stroke="#1D1D1F"
              stroke-width="1.70224"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <h1 className="text-[#1D1D1F] font-bold">دفع عن الاستلام</h1>
        </div>
      </div>
      {!user && (
        <div
          dir="rtl"
          className="bg-white space-y-8 w-full max-w-3xl shadow-sm p-10">
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-[#222222] text-2xl font-bold">
              المعلومات الشخصية
            </h1>
            {!isEdit && (
              <Button
                onClick={() => setIsEdit(true)}
                variant={"blackOutline"}
                size={"lg"}
                className="rounded-full">
                تغيير
              </Button>
            )}
          </div>
          {isEdit ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="w-full">الاسم الكامل</h1>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-3">
                <h1 className="w-full">الولاية</h1>
                <Input
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <h1 className="w-full">الهاتف</h1>
                <Input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <h1 className="w-full">عنوان الاقامة</h1>
                <Input
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <h1 className="w-full">ملاحظات</h1>
                <Input value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-1">
                <h3 className="text-[#676767]">الاسم الكامل :</h3>
                <h1 className="font-medium text-[#121111]">{name}</h1>
              </div>
              <div className="flex items-center gap-1">
                <h3 className="text-[#676767]">الهاتف :</h3>
                <h1 className="font-medium text-[#121111]">{phone}</h1>
              </div>
              <div className="flex items-center gap-1">
                <h3 className="text-[#676767]">العنوان :</h3>
                <h1 className="font-medium text-[#121111]">{adress}</h1>
              </div>
              <div className="flex items-center gap-1">
                <h3 className="text-[#676767]">الولاية :</h3>
                <h1 className="font-medium text-[#121111]">{wilaya}</h1>
              </div>
              <div className="flex items-center gap-1">
                <h3 className="text-[#676767]">الملاحظات :</h3>
                <h1 className="font-medium text-[#121111]">{note || "-"}</h1>
              </div>
            </div>
          )}
          <Button
            disabled={!adress || !name || !phone || !wilaya}
            onClick={() => setIsEdit(false)}
            variant={"yellow_brand"}
            size={"lg"}
            className="w-full">
            تأكيد
          </Button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
