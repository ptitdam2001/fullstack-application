import * as React from "react";

import { cn } from "../../utils/cn";
import { Separator } from "../Separator/Separator";

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

export { SidebarSeparator }
