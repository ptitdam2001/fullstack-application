export type WithDesignProps = {
  className?: string
}

export type WithDataTestIdProps = {
  testId?: string
}

export interface MenuItemProp {
  label: string
  link: string
  icon: React.ReactElement
  children?: MenuItemProp[]
}
