import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";
import { ButtonVariants } from "./ButtonVariants";

export const buttonVariants = ButtonVariants;

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof ButtonVariants> & {
    asChild?: boolean;
  };

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(ButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
};
