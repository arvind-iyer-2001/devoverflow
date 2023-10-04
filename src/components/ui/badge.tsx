import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "subtle-medium bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow",
        secondary:
          "subtle-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
        destructive:
          "subtle-medium bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow",
        outline: "text-foreground",
        title:
          "paragraph-medium bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export type BadgeVariants =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "title";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
