import classNames from 'classnames'
import { MenuItem } from './types'
import { Tooltip } from '@Common/components/Tooltip'
import { memo } from 'react'

type LateralMenuItemProps = {
  item: MenuItem
  expanded: boolean
  className?: string
}

const LateralMenuItem = ({ item, expanded, className }: LateralMenuItemProps) => (
  <div
    onClick={item.onClick}
    className={classNames('group p-2 flex flex-row gap-1 align-middle cursor-pointer items-center', className)}
  >
    <Tooltip position="right" title={expanded ? '' : item.label}>
      <div className="h-6 w-6">{item.icon}</div>
    </Tooltip>
    {expanded && <span className="flex-1">{item.label}</span>}
  </div>
)
export default memo(LateralMenuItem)
