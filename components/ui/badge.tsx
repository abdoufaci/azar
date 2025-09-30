import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        blue: "bg-[#DEEDFF] text-[#056BE4] hover:bg-[#DEEDFF]",
        orange: "bg-[#F3732324] text-[#F37323] hover:bg-[#F3732324]",
        red: "bg-[#BA000026] text-[#BA0000] hover:bg-[#BA000026]",
        green: "bg-[#21D95426] text-[#21D954] hover:bg-[#21D95426]",
        yellow: "bg-[#FFD12E26] text-[#FFD12E] hover:bg-[#FFD12E26]",
        purple: "bg-[#8A38F533] text-[#8A38F5] hover:bg-[#8A38F533]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
