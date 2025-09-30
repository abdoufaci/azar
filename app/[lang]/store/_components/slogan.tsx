import { Button } from "@/components/ui/button";
import { ArrowUpLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

function Slogan() {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 flex items-center justify-between flex-wrap gap-10">
      <Image
        alt="chaire"
        src={"/chaire.svg"}
        height={500}
        width={500}
        className="object-cover"
      />
      <div className="space-y-7 flex flex-col items-end">
        <h1 className="text-[#3B3B3B] font-medium w-full max-w-xl text-right">
          كل قطعة أثاث تحمل قصة — من اختيار أجود الأخشاب والأقمشة، إلى اللمسات
          الأخيرة في ورشنا. نعمل مع حرفيين محترفين في عدة أماكن لنقدم لك أثاثًا
          مصنوعًا بدقة وشغف واهتمام.
        </h1>
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

export default Slogan;
