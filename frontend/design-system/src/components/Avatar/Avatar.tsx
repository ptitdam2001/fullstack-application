import * as React from "react";

import { cn } from "../../utils/cn";
import { AvatarContext, type ImageStatus } from "./AvatarContext";

type Props = React.ComponentProps<"span">;

export const Avatar = ({ className, ...props }: Props) => {
  const [imageStatus, setImageStatus] = React.useState<ImageStatus>("loading");

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <span
        data-slot="avatar"
        className={cn(
          "relative flex min-h-4 min-w-4 shrink-0 overflow-hidden rounded-full",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
};
