import { MenuItem } from './types'
import { Tooltip } from '@Components/Tooltip'
import { memo } from 'react'
import { MenuListItem } from './styledComponent'
import classNames from 'classnames'

type LateralMenuItemProps = {
  item: MenuItem
  expanded: boolean
  className?: string
}

const LateralMenuItem = ({ item, expanded, className }: LateralMenuItemProps) => (
  <MenuListItem
    onClick={item.onClick}
    className={classNames('LateralMenuItem', className, {
      'hover:bg-slate-200/45 hover:text-slate-800 cursor-pointer': !!item.onClick,
    })}
  >
    <Tooltip position="right" title={expanded ? '' : item.label}>
      <div className="h-6 w-6">{item.icon}</div>
    </Tooltip>
    {expanded && <span className="flex-1">{item.label}</span>}
  </MenuListItem>
)
export default memo(LateralMenuItem)
