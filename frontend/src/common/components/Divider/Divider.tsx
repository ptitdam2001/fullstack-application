import { memo } from 'react'
import { DividerProps } from './types'
import classNames from 'classnames'

const Divider = ({ position = 'horizontal', className }: DividerProps) => (
  <hr
    className={classNames(
      {
        'divide-y': position === 'horizontal',
        'divide-x': position === 'vertical',
      },
      className
    )}
  />
)

export default memo(Divider)
