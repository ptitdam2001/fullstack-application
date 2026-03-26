import { cn } from "../../utils/cn";

export const CardContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div data-slot="card-content" className={cn("px-6", className)} {...props} />
);
