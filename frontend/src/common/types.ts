export type WithDesignProps = {
  className?: string
}

export type WithDataTestIdProps = {
  'data-testid'?: string
}

export interface MenuItemProp {
  label: string
  link: string
  icon: React.ReactElement
  children?: MenuItemProp[]
}
