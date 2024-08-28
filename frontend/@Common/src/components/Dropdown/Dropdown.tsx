import classNames from 'classnames'
import { cloneElement, memo, useCallback, useRef } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { DropDownProps } from './types'
import { DropdownButton, DropdownContainer, DropdownItem, DropdownMenu } from './styledComponent'
import { TextWithIcon } from '../Text'
import { useClickOutside } from '@Hooks/useClickOutside'
import { useToggle } from '@Hooks/useToggle'

const DropDown = ({ button, items, withDivider, icon, forceOpen, stayOpenOnClick = false }: DropDownProps) => {
  const wrapperRef = useRef(null)
  const { isOpen, toggleOpen, setIsOpen } = useToggle(false)

  useClickOutside([wrapperRef], () => {
    setIsOpen(false)
  })

  const initOnClick = useCallback(
    (callback?: VoidFunction) => () => {
      if (!stayOpenOnClick && !!callback) {
        toggleOpen()
      }

      if (callback) {
        return callback()
      }
    },
    [toggleOpen, stayOpenOnClick]
  )

  return (
    <DropdownContainer tabIndex={0} ref={wrapperRef}>
      <DropdownButton>
        {cloneElement(button, { onClick: toggleOpen, role: 'button' })}
        {icon ||
          (isOpen ? (
            <ChevronUpIcon className="w-5 h-5" onClick={toggleOpen} />
          ) : (
            <ChevronDownIcon className="w-5 h-5" onClick={toggleOpen} />
          ))}
      </DropdownButton>

      {(forceOpen || isOpen) && (
        <DropdownMenu role="menu" aria-orientation="vertical" aria-labelledby="options-menu" withDivider={withDivider}>
          {items.map(item => (
            <DropdownItem
              key={item.label}
              className={classNames(item.icon ? 'flex items-center' : 'block')}
              role="menuitem"
              onClick={initOnClick(item.onClick)}
            >
              {item.customRender ? (
                item.customRender
              ) : (
                <TextWithIcon icon={item.icon}>
                  <div className="py-1">
                    <p className="text-left">{item.label}</p>
                    {item.desc && <p className="text-xs text-gray-400">{item.desc}</p>}
                  </div>
                </TextWithIcon>
              )}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  )
}
export default memo(DropDown)
