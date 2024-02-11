import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { IconButton } from '../Buttons'
import { ChevronLeft, ChevronRight } from '../Icon'
import { MenuItem } from './types'
import { LateralMenuItem } from './LateralMenuItem'

type LateralMenuProps = {
  expanded?: boolean
  items: MenuItem[]
}

export const LateralMenu = ({ expanded = false, items }: LateralMenuProps) => {
  const [expandedMenu, setExpandedMenu] = useState<boolean>(expanded)

  useEffect(() => {
    setExpandedMenu(expanded)
  }, [expanded])

  const toggleExpanded = () => {
    setExpandedMenu((oldValue) => !oldValue)
  }
  const Icon = expandedMenu ? <ChevronLeft /> : <ChevronRight />

  return (
    <nav
      className={classNames('flex flex-col gap-1 transform transition-all duration-350 shadow-sm py-2 h-full bg-primary', {
        'w-48': expandedMenu,
        'w-10': !expandedMenu,
      })}
    >
      <div className="flex flex-row-reverse px-2">
        <IconButton onClick={toggleExpanded} icon={Icon} className="text-white" size="small" />
      </div>
      <hr className="divide-y" />
      <ul className="text-primaryText">
        {items.map((item, key) => (
          <li key={`menu-item-${key}`} className="h-10">
            <LateralMenuItem item={item} expanded={expandedMenu} className="hover:bg-slate-200 hover:text-slate-800 h-full" />
          </li>
        ))}
      </ul>
    </nav>
  )
}
