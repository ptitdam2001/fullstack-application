import { cn } from "../../utils/cn";

export const CardTitle = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="card-title"
    className={cn("leading-none font-semibold", className)}
    {...props}
  />
);
