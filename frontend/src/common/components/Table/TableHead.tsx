import { WithDesignProps } from '@Common/types'
import { PropsWithChildren, memo } from 'react'

type TableHeadProps = PropsWithChildren<WithDesignProps>

export const TableHead = memo(({ children, className }: TableHeadProps) => (
  <thead>
    <tr className={className}>{children}</tr>
  </thead>
))
