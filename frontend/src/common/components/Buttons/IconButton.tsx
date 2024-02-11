import classNames from 'classnames'
import { memo, useCallback, useMemo } from 'react'
import { ReactElement } from 'react'

export interface IconButtonProps {
  icon?: ReactElement
  children?: ReactElement
  onClick?: VoidFunction
  to?: string
  withBorder?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
  disabled?: boolean
}

const IconButton = ({
  onClick = () => {},
  children,
  icon,
  withBorder = false,
  size = 'medium',
  className,
  disabled = false,
}: IconButtonProps) => {
  const handleClick = useCallback(() => {
    onClick()
  }, [onClick])

  const iconSize = useMemo(
    () => ({
      'w-12 h-12': size === 'medium',
      'w-6 h-6': size === 'small',
      'w-24 h-24': size === 'large',
    }),
    [size]
  )

  return (
    <button
      onClick={handleClick}
      type="button"
      className={classNames(
        'flex justify-center items-center bg-transparent text-primary transition ease-in duration-200 text-center text-base font-semibold focus:outline-none focus:ring-1 focus:ring-offset-1 rounded-lg',
        className,
        {
          ...iconSize,
          'no-border': !withBorder,
          'border-solid border-2 border-primary shadow-md p-1': withBorder,
        }
      )}
      disabled={disabled}
    >
      {icon ? <span className={classNames('flex p-1', iconSize)}>{icon}</span> : children}
    </button>
  )
}

export default memo(IconButton)
