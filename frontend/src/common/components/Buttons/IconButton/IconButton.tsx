import classNames from 'classnames'
import { memo, useCallback, useMemo } from 'react'
import { ReactElement } from 'react'
import { BaseButtonProps } from '../types'

export interface IconButtonProps extends BaseButtonProps {
  withBorder?: boolean
  size?: 'small' | 'medium' | 'large'
}

const IconButton = ({
  onClick,
  type,
  children,
  icon,
  withBorder = false,
  size = 'medium',
  className,
  disabled = false,
}: IconButtonProps) => {
  const iconSize = useMemo(
    () => ({
      'w-12 h-12': size === 'medium',
      'w-6 h-6': size === 'small',
      'w-24 h-24': size === 'large',
    }),
    [size]
  )

  const classes = useMemo(
    () =>
      classNames(
        'flex justify-center items-center',
        'bg-transparent text-center text-base',
        disabled ? 'opacity-60 text-slate-400 bg-slate-200/50' : 'hover:bg-slate-200/50 text-primary',
        'transition ease-in duration-200 font-semibold',
        'focus:outline-none focus:ring-1 focus:ring-offset-1',
        'rounded-lg',
        className,
        {
          ...iconSize,
          'no-border': !withBorder,
          'border-solid border-primary shadow-md p-1': withBorder,
          border: withBorder && ['medium', 'small'].includes(size),
          'border-2': withBorder && ['large'].includes(size),
          'border-slate-400/60': withBorder && disabled,
        }
      ),
    [className, iconSize, withBorder, disabled]
  )

  return (
    <button onClick={onClick} type={type} role="button" className={classes} disabled={disabled}>
      {icon ? <span className={classNames('flex p-1', iconSize)}>{icon}</span> : children}
    </button>
  )
}

export default memo(IconButton)
