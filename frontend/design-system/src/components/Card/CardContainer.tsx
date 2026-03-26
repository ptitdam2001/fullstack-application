import { cn } from "../../utils/cn";

export const CardContainer = ({
  className,
  ...props
}: React.ComponentProps<"section">) => (
  <section
    data-slot="card"
    className={cn(
      "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      className,
    )}
    {...props}
  />
);
