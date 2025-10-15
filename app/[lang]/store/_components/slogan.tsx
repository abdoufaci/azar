import { Button } from "@/components/ui/button";
import { ArrowUpLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  dict: any;
}

function Slogan({ dict }: Props) {
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
          {dict?.slogan.title}
        </h1>
        <Button
          variant={"yellow_brand"}
          size={"lg"}
          className="rounded-full flex items-center gap-4 px-2 pr-5">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black">
            <ArrowUpLeft className="w-5 h-5" />
          </div>
          <span className="text-[#272727]">{dict?.all.discoverButton}</span>
        </Button>
      </div>
    </div>
  );
}

export default Slogan;
