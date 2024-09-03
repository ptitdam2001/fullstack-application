import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useState } from 'react'
import { BasePopoverProps } from './Provider/PopoverProvider'

export const usePopover = ({
  placement = 'bottom',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialOpen = false,
}: BasePopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(12), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    whileElementsMounted: autoUpdate,
    placement,
  })

  const click = useClick(floating.context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(floating.context)
  const role = useRole(floating.context)

  const interactions = useInteractions([click, dismiss, role])

  return {
    ...floating,
    ...interactions,
    isOpen: open,
    setOpen,
  }
}
