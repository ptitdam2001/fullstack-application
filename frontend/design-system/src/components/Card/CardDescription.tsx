import { cn } from "../../utils/cn";

export const CardDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="card-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);
