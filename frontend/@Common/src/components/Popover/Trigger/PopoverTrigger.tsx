import { ReactNode } from 'react'
import { usePopoverContext } from '../Provider/PopoverProvider'

type PopoverTriggerProps = {
  children: ReactNode
  onClick?: VoidFunction
}

export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => {
  const { refs, getReferenceProps } = usePopoverContext()

  return (
    <button ref={refs.setReference} {...getReferenceProps(props)}>
      {children}
    </button>
  )
}
