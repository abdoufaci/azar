"use client";

import { tajawal } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function StoreHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0); // true if user scrolled down
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      dir="rtl"
      className={cn(
        "h-[70px] sticky top-0 left-0 z-50 w-full px-6 py-4 transition-all duration-200 ease-out border-b border-b-[#D1D1D8]",
        tajawal.className,
        scrolled || pathname.length > 9 ? "bg-white" : "bg-transparent "
      )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-[#f2ba05] text-xl font-bold">
          Azar{" "}
          <span
            className={cn(
              scrolled || pathname.length > 9 ? "text-[#232626]" : "text-white"
            )}>
            Furniture
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
          <a
            href="#"
            className="text-[#f2ba05] hover:text-[#f1ba05] transition-colors font-medium">
            الرئيسية
          </a>
          <a
            href="#"
            className={cn(
              "hover:text-[#f2ba05] transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white"
            )}>
            منتجات
          </a>
          <a
            href="#"
            className={cn(
              "hover:text-[#f2ba05] transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white"
            )}>
            الطاولات
          </a>
          <a
            href="#"
            className={cn(
              "hover:text-[#f2ba05] transition-colors font-medium",
              scrolled || pathname.length > 9 ? "text-black" : "text-white"
            )}>
            الكراسي
          </a>
        </nav>

        {/* Login Button and Cart */}
        <div className="flex items-center gap-4">
          <Button className="bg-[#f2ba05] hover:bg-[#f1ba05] text-black font-medium px-6 py-2 rounded-lg">
            تسجيل الدخول
          </Button>
          <ShoppingCart
            className={cn(
              "w-6 h-6",
              scrolled || pathname.length > 9 ? "text-black" : "text-white"
            )}
          />
        </div>
      </div>
    </header>
  );
}

export default StoreHeader;
