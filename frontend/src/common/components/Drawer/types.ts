import { WithDataTestIdProps, WithDesignProps } from '@Common/types'
import { ReactElement, ReactNode } from 'react'

export interface DrawerProps extends WithDataTestIdProps, WithDesignProps {
  open?: boolean
  toggleIcon?: ReactElement
  closeIcon?: ReactElement
  position?: 'left' | 'right'
  title?: string
  content: ReactNode
  onOpenChange?: (openValue: boolean) => void
}
