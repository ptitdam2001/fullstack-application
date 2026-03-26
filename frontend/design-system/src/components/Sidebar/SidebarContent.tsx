import * as React from "react";

import { cn } from "../../utils/cn";

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden px-2",
        className,
      )}
      {...props}
    />
  );
}

export { SidebarContent }
