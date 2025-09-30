import { Button } from "@/components/ui/button";
import { ArrowUpLeft } from "lucide-react";
import React from "react";

function Banner() {
  return (
    <div
      style={{
        backgroundImage: "url('/banner.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="relative z-0 h-[130vh] flex items-center justify-center w-full px-6 -mt-[70px]">
      <div className="text-center flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2 top-[25%] w-full">
        {/* Main Heading */}
        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight text-balance">
          من ورشتنا... إلى قلب منزلك
        </h1>

        {/* Description */}
        <p className="text-[#d1d1d8] text-lg lg:text-xl mb-12 leading-relaxed max-w-4xl mx-auto text-balance">
          نصنع كل قطعة بعناية، لتصميمها لراحتك، ونضمن جودتها لتدوم لسنوات. اكتشف
          تشكيلتنا التي تضيف الأناقة والدفء إلى منزلك.
        </p>

        {/* CTA Button */}
        <Button
          variant={"yellow_brand"}
          size={"lg"}
          className="rounded-full flex items-center gap-4 px-2 pr-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black">
            <ArrowUpLeft className="w-5 h-5" />
          </div>
          <span className="text-[#272727]">اكتشف منتجاتنا</span>
        </Button>
      </div>
    </div>
  );
}

export default Banner;
