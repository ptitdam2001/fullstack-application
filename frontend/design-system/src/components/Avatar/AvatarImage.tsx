import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../utils/cn";

type Props = React.ComponentProps<typeof AvatarPrimitive.Image>;

export const AvatarImage = ({ className, ...props }: Props) => (
  <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn("aspect-square size-full", className)}
    {...props}
  />
);
