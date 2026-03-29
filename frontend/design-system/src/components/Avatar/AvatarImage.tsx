import * as React from "react";

import { cn } from "../../utils/cn";
import { useAvatarContext } from "./AvatarContext";

type Props = React.ComponentProps<"img">;

export const AvatarImage = ({ className, onLoad, onError, ...props }: Props) => {
  const { setImageStatus } = useAvatarContext();

  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      onLoad={(e) => {
        setImageStatus("loaded");
        onLoad?.(e);
      }}
      onError={(e) => {
        setImageStatus("error");
        onError?.(e);
      }}
      {...props}
    />
  );
};
