import * as React from 'react'
import { ButtonContext, OverlayTriggerStateContext, useContextProps } from 'react-aria-components'

type TriggerRenderProps = {
  ref: React.Ref<HTMLButtonElement>
  'aria-expanded'?: React.AriaAttributes['aria-expanded']
  'aria-haspopup'?: React.AriaAttributes['aria-haspopup']
  onClick: () => void
}

type PopoverTriggerProps = { children: (props: TriggerRenderProps) => React.ReactNode }

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const state = React.useContext(OverlayTriggerStateContext)

  const [{ 'aria-expanded': ariaExpanded, 'aria-haspopup': ariaHasPopup }, mergedRef] = useContextProps(
    {} as React.HTMLAttributes<HTMLButtonElement>,
    ref,
    ButtonContext
  )

  return children({
    ref: mergedRef,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHasPopup,
    onClick: () => state?.toggle(),
  })
}
