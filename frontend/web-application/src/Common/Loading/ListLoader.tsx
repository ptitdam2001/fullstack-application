import { Skeleton } from '@repo/design-system'
import { cn } from '@repo/design-system'

type ListLoaderProps = {
  className?: string
  nbLines: number
}
export const ListLoader = ({ className, nbLines }: ListLoaderProps) => (
  <ul className={cn('flex w-full flex-col gap-4', className)}>
    {Array.from({ length: nbLines }, (_, idx) => (
      <li key={`skeleton-${nbLines}-${idx}`} className="py-1">
        <Skeleton className={cn('h-10 rounded-md')} />
      </li>
    ))}
  </ul>
)
