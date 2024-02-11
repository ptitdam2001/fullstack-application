import classNames from 'classnames'
import { ReactElement, ReactNode, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'

export interface PrimaryButtonProps {
  icon?: ReactNode
  label?: string | ReactElement
  children?: ReactNode
  onClick?: VoidFunction
  to?: string
  fullwidth?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
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
}: PrimaryButtonProps) => {
  const handleClick = useCallback(() => {
    onClick()
  }, [onClick])

  const classname = classNames(
    'transition ease-in duration-200 text-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-fit',
    { 'w-full': fullwidth }
  )

  if (to) {
    return (
      <Link to={to} className={classname}>
        {icon && <span className="mr-2">{icon}</span>}
        {children || label}
      </Link>
    )
  }

  return (
    <button type={type} onClick={handleClick} className={classname} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children || label}
    </button>
  )
}

export default memo(PrimaryButton)
