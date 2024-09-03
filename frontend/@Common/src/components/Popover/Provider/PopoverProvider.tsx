import { createContext, ReactNode, useContext } from 'react'
import { usePopover } from '../usePopover'
import { Placement } from '@floating-ui/react'

export type BasePopoverProps = {
  placement?: Placement
  initialOpen?: boolean
  open?: boolean
  onOpenChange?: (newOpenVal: boolean) => void
}

export type PopoverProps = {
  children: ReactNode
} & BasePopoverProps

const noProvider = Symbol('no provider')

type ContextType = ReturnType<typeof usePopover>

const context = createContext<ContextType | typeof noProvider>(noProvider)
context.displayName = 'PopoverContextProvider'

export const usePopoverContext = () => {
  const value = useContext(context)

  if (value === noProvider) {
    throw new Error(`usePopoverConfig is used outside of its PopoverConfigProvider`)
  }

  return value
}

export const PopoverProvider = ({ children, ...props }: PopoverProps) => {
  const popoverContext = usePopover(props)

  return <context.Provider value={popoverContext}>{children}</context.Provider>
}
