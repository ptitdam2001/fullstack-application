export type WithDesignProps = {
  className?: string
}

export type WithDateTestIdProps = {
  'data-testid'?: string
}

export interface MenuItemProp {
  label: string
  link: string
  icon: React.ReactElement
  children?: MenuItemProp[]
}
