import { MenuItem } from '../types'
import { Tooltip } from '@Components/Tooltip/Tooltip'
import { memo, useCallback } from 'react'
import { MenuListItem } from './styledComponent'
import { classnameMerge } from '@Utils/classnames'

type LateralMenuItemProps = {
  item: MenuItem
  expanded: boolean
  className?: string
}

export const LateralMenuItem = memo(({ item, expanded, className }: LateralMenuItemProps) => {
  const handleClick = useCallback(() => {
    if (item.onClick) {
      item.onClick()
    }
  }, [item])

  return (
    <MenuListItem
      onClick={handleClick}
      className={classnameMerge('LateralMenuItem', className, {
        'hover:bg-slate-200/45 hover:text-slate-800 cursor-pointer': !!item.onClick,
      })}
    >
      <Tooltip position="right" title={expanded ? '' : item.label}>
        <div className="h-6 w-6">{item.icon}</div>
      </Tooltip>
      {expanded && <span className="flex-1">{item.label}</span>}
    </MenuListItem>
  )
})
