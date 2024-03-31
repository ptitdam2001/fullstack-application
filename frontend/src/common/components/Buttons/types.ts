import { WithDateTestIdProps, WithDesignProps } from "@Common/types"
import { ReactNode } from "react"

export interface BaseButtonProps extends WithDesignProps, WithDateTestIdProps{
  icon?: ReactNode
  children?: ReactNode
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}
