import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";
import { BadgeVariants } from "./BadgeVariant";

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof BadgeVariants> & { asChild?: boolean };

export const Badge = ({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(BadgeVariants({ variant }), className)}
      {...props}
    />
  );
};
