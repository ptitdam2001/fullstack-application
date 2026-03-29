import * as React from "react";

import { cn } from "../../utils/cn";
import { useAvatarContext } from "./AvatarContext";

type Props = React.ComponentProps<"span"> & {
  delayMs?: number;
};

export const AvatarFallback = ({ className, delayMs, ...props }: Props) => {
  const { imageStatus } = useAvatarContext();
  const [show, setShow] = React.useState(delayMs === undefined);

  React.useEffect(() => {
    if (delayMs !== undefined) {
      const timer = setTimeout(() => setShow(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  if (!show || imageStatus === "loaded") return null;

  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
};
