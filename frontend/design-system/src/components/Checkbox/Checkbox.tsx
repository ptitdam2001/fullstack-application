import { Checkbox as AriaCheckbox, composeRenderProps } from 'react-aria-components'
import type { CheckboxProps as AriaCheckboxProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type CheckboxProps = AriaCheckboxProps

export const Checkbox = ({ className, children, ...props }: CheckboxProps) => (
  <AriaCheckbox
    data-slot="checkbox"
    className={composeRenderProps(className, cls =>
      cn('group flex cursor-pointer items-center gap-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50', cls)
    )}
    {...props}
  >
    {renderProps => (
      <>
        <span
          className={cn(
            'flex size-4 shrink-0 items-center justify-center rounded-sm border border-input shadow-xs transition-colors',
            'group-data-[selected]:bg-primary group-data-[selected]:border-primary group-data-[selected]:text-primary-foreground',
            'group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary group-data-[indeterminate]:text-primary-foreground',
            'group-data-[focus-visible]:ring-ring/50 group-data-[focus-visible]:ring-[3px]',
            'group-data-[invalid]:border-destructive'
          )}
          aria-hidden
        >
          {renderProps.isIndeterminate ? (
            <svg viewBox="0 0 16 16" className="size-3 fill-current">
              <rect x="2" y="7" width="12" height="2" rx="1" />
            </svg>
          ) : renderProps.isSelected ? (
            <svg viewBox="0 0 16 16" className="size-3 fill-current">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
            </svg>
          ) : null}
        </span>
        {typeof children === 'function' ? children(renderProps) : children}
      </>
    )}
  </AriaCheckbox>
)
