import classNames from 'classnames'
import { ReactElement, memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BaseButtonProps } from '../types'

export interface PrimaryButtonProps extends BaseButtonProps {
  label?: string | ReactElement
  fullwidth?: boolean
}

const PrimaryButton = ({
  label,
  onClick = () => {},
  children,
  icon,
  fullwidth = false,
  type = 'button',
  to,
  disabled = false,
  className: classes,
}: PrimaryButtonProps) => {
  const classname = useMemo(
    () =>
      classNames(
        classes,
        'text-center text-sm font-semibold',
        'transition ease-in duration-200 rounded-md bg-primary px-4 py-2 shadow-sm',
        'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2',
        'flex place-items-center w-fit',
        { 'opacity-30 text-slate-200': disabled },
        { 'hover:bg-primary/60 text-white': !disabled },
        'ring-current ring-2 ring-blue-400/50',
        { 'w-full': fullwidth }
      ),
    [fullwidth, disabled]
  )

  if (to) {
    return (
      <Link to={to} className={classname} role="link">
        {icon && <span className="mr-2">{icon}</span>}
        {children || label}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classname} disabled={disabled} role="button">
      {icon && <span className="mr-2 size-4">{icon}</span>}
      {children || label}
    </button>
  )
}

export default memo(PrimaryButton)
