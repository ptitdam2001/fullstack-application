import { cn } from "../../utils/cn";

export const CardFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="card-footer"
    className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
    {...props}
  />
);
