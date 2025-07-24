import { FC, ReactNode } from 'react'
import { MenuBarActionLink } from './types'
import { LinkAction } from './LinkAction'

const isBarLink = (elt: ReactNode | MenuBarActionLink): elt is MenuBarActionLink =>
  (elt as MenuBarActionLink).url !== undefined

type MenuBarAction = ReactNode | MenuBarActionLink

type MenuBarProps = {
  leftActions?: MenuBarAction[]
  children?: ReactNode
  rightActions?: MenuBarAction[]
}

export const MenuBar: FC<MenuBarProps> = ({ children, leftActions, rightActions }) => {
  return (
    <section className="MenuBar w-full flex flex-row gap-1 py-1">
      {leftActions && leftActions?.length > 0 && (
        <div>{leftActions.map(action => (isBarLink(action) ? <LinkAction {...action} /> : action))}</div>
      )}

      <div className="w-full">{children}</div>
      {rightActions && rightActions?.length > 0 && (
        <div>{rightActions.map(action => (isBarLink(action) ? <LinkAction {...action} /> : action))}</div>
      )}
    </section>
  )
}
