import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { BaseInputProps } from './types'

export interface PasswordInputProps extends BaseInputProps {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ label, id, name, className, error, ...args }, ref) => {
  const [show, setShow] = useState<boolean>(false)

  const inputId = id || name
  const inputErrorClass = error ? 'ring-red-500 ring-1' : ''
  const toogleIconClass = classNames('h-5 w-5', { 'fill-red-500': error })

  const handleToggleMode = useCallback(() => setShow((oldValue) => !oldValue), [setShow])

  return (
    <div className={classNames('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="text-gray-700">
          {label}
          <span className="text-red-500 required-dot">*</span>
        </label>
      )}
      <div className="flex relative">
        <input
          ref={ref}
          id={inputId}
          type={show ? 'text' : 'password'}
          className={classNames(
            'rounded-l-lg flex-1 border-transparent appearance-none border border-gray-400 border-r-0 w-full py-2 px-4 bg-gray-100 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
            inputErrorClass
          )}
          {...args}
          name={name}
        />
        <span
          onClick={handleToggleMode}
          className={classNames(
            'rounded-r-lg inline-flex items-center px-3 border-t bg-gray-50 border-r border-b border-gray-100 text-gray-500 shadow-sm text-sm hover:cursor-pointer',
            inputErrorClass
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={toogleIconClass}>
            {show ? (
              <>
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fill-rule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                  clip-rule="evenodd"
                />
              </>
            ) : (
              <>
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
              </>
            )}
          </svg>
        </span>
      </div>

      {error && <label className="prose text-red-500 prose-sm">{error}</label>}
    </div>
  )
})
