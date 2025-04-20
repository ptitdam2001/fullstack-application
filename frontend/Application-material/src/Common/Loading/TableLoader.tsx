import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type TableLoaderProps = {
  className?: string
  nbCols: number
  nbRows: number
}

export const TableLoader: React.FunctionComponent<TableLoaderProps> = ({ className, nbCols, nbRows }) => (
  <div className={cn('flex flex-col gap-4 w-full', className)}>
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length: nbCols }, (_, i) => (
        <Skeleton
          key={`skeleton-header-${i}`}
          className={cn('rounded-md h-10')}
          style={{ width: 'calc(' + 1 / nbCols + '*100%)' }}
        />
      ))}
    </div>
    <div className="flex flex-col gap-2">
      {Array.from({ length: nbRows }, (_, i) => (
        <Skeleton key={`skeleton-row-${i}`} className="w-full h-12 rounded-md" />
      ))}
    </div>
  </div>
)
