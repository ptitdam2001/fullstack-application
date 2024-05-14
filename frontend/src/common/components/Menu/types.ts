import { ReactNode } from 'react'

export type MenuItem = {
  icon: ReactNode
  label: string
  onClick?: VoidFunction
  children?: MenuItem[]
}
