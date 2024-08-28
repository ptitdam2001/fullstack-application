import { ReactElement, ReactNode } from 'react'

export interface DropDownItem {
  icon?: JSX.Element
  label: string
  desc?: string
  onClick?: VoidFunction
  customRender?: ReactNode
}

export interface DropDownProps {
  button: ReactElement
  //boolean to always open ddm (for presentation)
  forceOpen?: boolean
  withDivider?: boolean
  icon?: JSX.Element
  items: DropDownItem[]
  stayOpenOnClick?: boolean
}
