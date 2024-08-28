import { WithDataTestIdProps, WithDesignProps } from '../../types'
import { ReactNode } from 'react'

export interface BaseButtonProps extends WithDesignProps, WithDataTestIdProps {
  icon?: ReactNode
  children?: ReactNode
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}
