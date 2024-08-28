import { memo } from 'react'
import { DividerProps } from './types'
import classNames from 'classnames'

export const Divider = memo(({ position = 'horizontal', className }: DividerProps) => (
  <hr
    className={classNames(
      {
        'divide-y': position === 'horizontal',
        'divide-x': position === 'vertical',
      },
      className
    )}
  />
))
