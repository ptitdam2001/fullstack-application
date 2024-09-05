import { DropDownProps } from './types'
import { DropdownItem, DropdownMenu } from './styledComponent'
import { classnameMerge } from '@Utils/classnames'
import { DropdownItemContent } from './DropdownItem'
import { Popover } from '../Popover/Popover'
import { useState } from 'react'
import { DropdownButton } from './DropdownButton'

export const DropDown = ({
  button,
  items,
  withDivider,
  icon,
  forceOpen = false,
  stayOpenOnClick = false,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen)

  return (
    <Popover.Container open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        onClick={() => {
          setIsOpen(v => !v)
        }}
      >
        <DropdownButton icon={icon}>{button}</DropdownButton>
      </Popover.Trigger>

      <Popover.Content>
        {close => (
          <DropdownMenu
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            withDivider={withDivider}
          >
            {items.map(item => (
              <DropdownItem
                key={item.label}
                className={classnameMerge(item.icon ? 'flex items-center' : 'block')}
                role="menuitem"
                onClick={() => {
                  if (!stayOpenOnClick) {
                    close()
                  }
                  if (item.onClick) {
                    item.onClick()
                  }
                }}
              >
                <DropdownItemContent item={item} />
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Popover.Content>
    </Popover.Container>
  )
}
