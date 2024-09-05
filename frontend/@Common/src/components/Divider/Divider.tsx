import { memo } from 'react'
import { classnameMerge } from '@Utils/classnames'
import { WithDesignProps } from 'types'

type DividerProps = {
  position?: 'vertical' | 'horizontal'
} & WithDesignProps

export const Divider = memo(({ position = 'horizontal', className }: DividerProps) => (
  <hr className={classnameMerge(position === 'horizontal' ? 'divide-y' : 'divide-x', className)} />
))
