import * as React from 'react'

type AnyProps = Record<string, unknown>

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps }

  for (const key in slotProps) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (key === 'className') {
      merged[key] =
        slotValue && childValue
          ? `${slotValue} ${childValue}`
          : slotValue || childValue
    } else if (key === 'style') {
      merged[key] =
        slotValue && childValue
          ? { ...(slotValue as object), ...(childValue as object) }
          : slotValue || childValue
    } else if (typeof slotValue === 'function' && typeof childValue === 'function') {
      merged[key] = (...args: unknown[]) => {
        childValue(...args)
        slotValue(...args)
      }
    } else {
      merged[key] = childValue !== undefined ? childValue : slotValue
    }
  }

  return merged
}

const Slot = React.forwardRef<Element, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) return null

    const childProps = children.props as AnyProps
    const merged = mergeProps(slotProps as AnyProps, childProps)

    if (forwardedRef) {
      merged['ref'] = forwardedRef
    }

    return React.cloneElement(children, merged)
  }
)

Slot.displayName = 'Slot'

export { Slot }
