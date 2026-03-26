import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../utils/cn";

type Props = React.ComponentProps<typeof AvatarPrimitive.Root>;

export const Avatar = ({ className, ...props }: Props) => (
  <AvatarPrimitive.Root
    data-slot="avatar"
    className={cn(
      "relative flex min-h-4 min-w-4 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
);
