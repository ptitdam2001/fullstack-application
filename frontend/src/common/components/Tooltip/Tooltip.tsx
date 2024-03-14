import classNames from 'classnames'
import { ReactNode, memo, useMemo } from 'react'

type TooltipProps = {
  title?: ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
  children?: ReactNode
}

const Tooltip = ({ title, children, position = 'top' }: TooltipProps) => {
  const tooltipClasses = useMemo(() => {
    switch (position) {
      case 'bottom':
        return {
          body: 'border-light text-body-color absolute top-full left-1/2 z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded border bg-white py-[6px] px-4 text-sm font-semibold opacity-0 group-hover:opacity-100',
          footer: 'border-light absolute -top-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm border-t border-l bg-white',
        }

      case 'left':
        return {
          body: 'border-light text-body-color absolute right-full top-1/2 z-20 mr-3 -translate-y-1/2 whitespace-nowrap rounded border bg-white py-[6px] px-4 text-sm font-semibold opacity-0 group-hover:opacity-100',
          footer: 'border-light absolute -right-1 top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-sm border-t border-r bg-white',
        }

      case 'right':
        return {
          body: 'border-light text-body-color absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded border bg-white py-[6px] px-4 text-sm font-semibold opacity-0 group-hover:opacity-100',
          footer: 'border-light absolute -left-1 top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45 rounded-r-sm border-b border-l bg-white',
        }

      case 'top':
      default:
        return {
          body: 'border-light text-body-color absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded border bg-white py-[6px] px-4 text-sm font-semibold opacity-0 group-hover:opacity-100',
          footer: 'border-light absolute -bottom-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-l-sm border-b border-r bg-white',
        }
    }
  }, [position])

  return title && children ? (
    <div className="group relative w-full h-full">
      {children}
      <div className={classNames(tooltipClasses.body)}>
        <span className={classNames(tooltipClasses.footer)}></span>
        {title}
      </div>
    </div>
  ) : (
    children ?? null
  )
}
export default memo(Tooltip)
