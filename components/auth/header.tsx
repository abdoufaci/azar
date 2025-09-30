import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
  subLabel?: string;
}

export const Header = ({ label, subLabel }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="font-medium text-4xl">{label}</h1>
      <h3 className="whitespace-break-spaces text-[#576070] text-center">
        {subLabel}
      </h3>
    </div>
  );
};
