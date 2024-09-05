import { memo, useEffect, useState } from 'react'
import { IconButton } from '@Components/Buttons'
import { ChevronLeft, ChevronRight } from '@Components/Icon'
import { MenuItem } from '../types'
import { Divider } from '@Components/Divider/Divider'
import { LateralMenuItem } from './LateralMenuItem'
import { MenuContainer, MenuHeader, MenuList } from './styledComponent'
import { classnameMerge } from '@Utils/classnames'

type LateralMenuProps = {
  expanded?: boolean
  items: MenuItem[]
}

export const LateralMenu = memo(({ expanded = false, items }: LateralMenuProps) => {
  const [expandedMenu, setExpandedMenu] = useState<boolean>(expanded)

  useEffect(() => {
    setExpandedMenu(expanded)
  }, [expanded])

  const toggleExpanded = () => {
    setExpandedMenu(oldValue => !oldValue)
  }
  const Icon = expandedMenu ? <ChevronLeft /> : <ChevronRight />

  return (
    <MenuContainer className={classnameMerge(expandedMenu ? `w-48` : `w-10`, 'Menu')}>
      <MenuHeader className="MenuHeader">
        <IconButton onClick={toggleExpanded} icon={Icon} size="small" className="text-white" />
      </MenuHeader>
      <Divider position="horizontal" />
      <MenuList className="MenuList">
        {items.map(item => (
          <LateralMenuItem item={item} expanded={expandedMenu} />
        ))}
      </MenuList>
    </MenuContainer>
  )
})
