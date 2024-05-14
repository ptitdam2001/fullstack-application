import { memo, useEffect, useState } from 'react'
import { IconButton } from '../Buttons'
import { ChevronLeft, ChevronRight } from '../Icon'
import { MenuItem } from './types'
import LateralMenuItem from './LateralMenuItem'
import { Divider } from '../Divider'
import { MenuContainer, MenuHeader, MenuList } from './styledComponent'
import classNames from 'classnames'

type LateralMenuProps = {
  expanded?: boolean
  items: MenuItem[]
}

export const LateralMenuComponent = ({ expanded = false, items }: LateralMenuProps) => {
  const [expandedMenu, setExpandedMenu] = useState<boolean>(expanded)

  useEffect(() => {
    setExpandedMenu(expanded)
  }, [expanded])

  const toggleExpanded = () => {
    setExpandedMenu(oldValue => !oldValue)
  }
  const Icon = expandedMenu ? <ChevronLeft /> : <ChevronRight />

  return (
    <MenuContainer className={classNames(expandedMenu ? `w-48` : `w-10`, 'Menu')}>
      <MenuHeader className="MenuHeader">
        <IconButton onClick={toggleExpanded} icon={Icon} size="small" className="text-white" />
      </MenuHeader>
      <Divider position="horizontal" />
      <MenuList className="MenuList">
        {items.map((item, key) => (
          <LateralMenuItem key={`menu-item-${key}`} item={item} expanded={expandedMenu} />
        ))}
      </MenuList>
    </MenuContainer>
  )
}
export const LateralMenu = memo(LateralMenuComponent)
