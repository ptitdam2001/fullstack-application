import { type FC, type ReactNode } from 'react'
import { type MenuBarActionLink } from './types'
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
    <section className="MenuBar flex w-full flex-row gap-1 px-1.5 py-1">
      {leftActions && leftActions?.length > 0 && (
        <ul className="flex gap-0.5">
          {leftActions.map((action, idx) => (
            <li className="flex items-center px-1" key={isBarLink(action) ? action.url : `left-action-${idx}`}>
              {isBarLink(action) ? <LinkAction {...action} /> : action}
            </li>
          ))}
        </ul>
      )}

      <div className="w-full">{children}</div>
      {rightActions && rightActions?.length > 0 && (
        <div>
          {rightActions.map(action => (isBarLink(action) ? <LinkAction {...action} key={action.url} /> : action))}
        </div>
      )}
    </section>
  )
}
