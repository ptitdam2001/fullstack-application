import { ReactNode } from "react"

export interface BaseButtonProps {
  icon?: ReactNode
  children?: ReactNode
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}
