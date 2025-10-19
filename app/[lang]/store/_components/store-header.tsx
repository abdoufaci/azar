"use client";

import { tajawal } from "@/app/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "@/components/user-avatar";
import { useCartQuery } from "@/hooks/use-cart-query";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { ExtendedUser } from "@/types/next-auth";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  lang: any;
  dict: any;
}

function StoreHeader({ dict, lang }: Props) {
  const user = useCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const parts = pathname.split("/");
  const { data: cart } = useCartQuery();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0); // true if user scrolled down
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={cn(
        "h-[70px] sticky top-0 left-0 z-50 w-full px-6 py-4 transition-all duration-200 ease-out border-b border-b-[#D1D1D8]",
        tajawal.className,
        scrolled || pathname.length > 9 ? "bg-white" : "bg-transparent "
      )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href={"/store"}>
          <div className="text-yellow-brand text-xl font-bold">
            Azar{" "}
            <span
              className={cn(
                scrolled || pathname.length > 9
                  ? "text-[#232626]"
                  : "text-white"
              )}>
              Furniture
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          className={cn(
            "hidden md:flex items-center space-x-8",
            lang === "ar" && "space-x-reverse"
          )}>
          <Link
            href="/store"
            className={cn(
              "hover:text-yellow-brand transition-colors font-medium",
              parts.length === 3 && "text-yellow-brand hover:text-yellow-brand"
            )}>
            {dict?.storeHeader.home}
          </Link>
          <Link
            href="/store/salon"
            className={cn(
              "hover:text-yellow-brand transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white",
              parts?.[3] === "salon" &&
                "text-yellow-brand hover:text-yellow-brand"
            )}>
            {dict?.storeHeader.salon}
          </Link>
          <Link
            href="/store/table"
            className={cn(
              "hover:text-yellow-brand transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white",
              parts?.[3] === "table" &&
                "text-yellow-brand hover:text-yellow-brand"
            )}>
            {dict?.storeHeader.table}
          </Link>
          <Link
            href="/store/chair"
            className={cn(
              "hover:text-yellow-brand transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white",
              parts?.[3] === "chair" &&
                "text-yellow-brand hover:text-yellow-brand"
            )}>
            {dict?.storeHeader.chair}
          </Link>
        </nav>

        {/* Login Button and Cart */}
        <div className="flex items-center gap-4">
          {user ? (
            <UserAvatar isHeader />
          ) : (
            <Link href={"/auth/login"}>
              <Button className="bg-yellow-brand hover:bg-[#f1ba05] text-black font-medium px-6 py-2 rounded-lg">
                تسجيل الدخول
              </Button>
            </Link>
          )}
          <Link href={"/store/cart"}>
            <div className="relative">
              <ShoppingCart
                className={cn(
                  "w-6 h-6",
                  scrolled || pathname.length > 9 ? "text-black" : "text-white"
                )}
              />
              {!!cart?.items?.length && (
                <div className="h-5 w-5 rounded-full bg-yellow-brand text-white flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <h3 className="text-xs">{cart?.items?.length}</h3>
                </div>
              )}
            </div>
          </Link>
          <Popover>
            <PopoverTrigger asChild className="focus-within:ring-0 ring-0">
              <div
                className={cn(
                  "uppercase cursor-pointer text-sm flex items-center justify-center h-9 w-9 rounded-full border",
                  (pathname === "/fr/store" || pathname === "/ar/store") &&
                    !scrolled
                    ? "text-white border-white"
                    : "text-black border-black"
                )}>
                <h1>{lang === "ar" ? "عر" : "fr"}</h1>
              </div>
            </PopoverTrigger>
            <PopoverContent className="focus-within:ring-0 w-fit p-1 space-y-1 px-2">
              <Link
                href={
                  lang === "fr"
                    ? pathname?.replace("fr", "ar") || ""
                    : pathname?.replace("ar", "ar") || ""
                }>
                <div
                  className="flex items-center gap-2 text-black font-medium cursor-pointer p-1 rounded hover:bg-black/5 transition-all 
          duration-200 text-sm">
                  <h3>عر</h3>
                </div>
              </Link>
              <Link
                href={
                  lang === "fr"
                    ? pathname?.replace("fr", "fr") || ""
                    : pathname?.replace("ar", "fr") || ""
                }>
                <div
                  className="flex items-center gap-2 text-black font-medium cursor-pointer p-1 rounded hover:bg-black/5 transition-all 
          duration-200 text-sm">
                  <h3>FR</h3>
                </div>
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export default StoreHeader;
