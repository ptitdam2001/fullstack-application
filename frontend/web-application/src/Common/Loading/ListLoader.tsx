import { Skeleton } from '@repo/design-system'
import { cn } from '@repo/design-system'

type ListLoaderProps = {
  className?: string
  nbLines: number
}
export const ListLoader = ({ className, nbLines }: ListLoaderProps) => (
  <ul className={cn('flex flex-col gap-4 w-full', className)}>
    {Array.from({ length: nbLines }, (_, idx) => (
      <li key={`skeleton-${nbLines}-${idx}`} className="py-1">
        <Skeleton className={cn('rounded-md h-10')} />
      </li>
    ))}
  </ul>
)
