import { memo } from 'react'
import { DividerProps } from './types'
import { classnameMerge } from '@Utils/classnames'

export const Divider = memo(({ position = 'horizontal', className }: DividerProps) => (
  <hr
    className={classnameMerge(
      {
        'divide-y': position === 'horizontal',
        'divide-x': position === 'vertical',
      },
      className
    )}
  />
))
