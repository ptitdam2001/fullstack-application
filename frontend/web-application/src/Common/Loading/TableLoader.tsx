import { Skeleton } from '@repo/design-system'
import { cn } from '@repo/design-system'

type TableLoaderProps = {
  className?: string
  nbCols: number
  nbRows: number
}

export const TableLoader: React.FunctionComponent<TableLoaderProps> = ({ className, nbCols, nbRows }) => (
  <div className={cn('flex w-full flex-col gap-4', className)}>
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length: nbCols }, (_, i) => (
        <Skeleton
          key={`skeleton-header-${i}`}
          className={cn('h-10 rounded-md')}
          style={{ width: 'calc(' + 1 / nbCols + '*100%)' }}
        />
      ))}
    </div>
    <div className="flex flex-col gap-2">
      {Array.from({ length: nbRows }, (_, i) => (
        <Skeleton key={`skeleton-row-${i}`} className="h-12 w-full rounded-md" />
      ))}
    </div>
  </div>
)
