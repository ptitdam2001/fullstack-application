import classNames from 'classnames'
import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DropDownItem } from './types'

export interface DropDownProps {
  //boolean to always open ddm (for presentation)
  forceOpen?: boolean
  label?: string
  withDivider?: boolean
  icon?: JSX.Element
  items: DropDownItem[]
  withBackground?: boolean
  closeOnClick?: boolean
}

const DropDown = ({ items, withBackground, withDivider, icon, label, forceOpen, closeOnClick = false }: DropDownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  const toggleDropdown = () => {
    setIsOpen((oldValue) => !oldValue)
  }

  const handleClickLink = (link: string) => () => {
    if (closeOnClick) {
      toggleDropdown()
    }
    navigate(link)
  }

  const handleClick = (onClick?: () => void) => () => {
    if (closeOnClick) {
      toggleDropdown()
    }
    onClick?.()
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className={classNames(
            'flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500',
            {
              'border border-gray-300 bg-white dark:bg-gray-800 shadow-sm': withBackground,
            }
          )}
          id="options-menu"
        >
          {label}

          {icon || (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
            </svg>
          )}
        </button>
      </div>

      {(forceOpen || isOpen) && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div
            className={classNames('py-1', { 'divide-y divide-gray-100': withDivider })}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {items.map((item) => {
              return (
                <button
                  key={item.label}
                  onClick={item.link ? handleClickLink(item.link) : handleClick(item.onClick)}
                  className={classNames(
                    'w-full block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600',
                    item.icon ? 'flex items-center' : 'block'
                  )}
                  role="menuitem"
                >
                  <div className="flex flex-row">
                    {item.icon}
                    <span className="flex-grow flex flex-col">
                      <span className="text-left">{item.label}</span>
                      {item.desc && <span className="text-xs text-gray-400">{item.desc}</span>}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
export default memo(DropDown)
