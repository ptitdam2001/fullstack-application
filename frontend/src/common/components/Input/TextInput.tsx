import classNames from 'classnames'
import { BaseInputProps } from './types'
import React from 'react'

export interface TextInputProps extends BaseInputProps {}

export const TextInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const { label, id, name, className, error, required, ...args } = props
  const inputId = id || name
  const inputErrorClass = error ? 'ring-red-500 ring-1' : ''

  return (
    <div className={classNames('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="text-gray-700">
          {label}
          {required && <span className="text-red-500 required-dot">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="text"
        className={classNames(
          'form-input rounded-lg border-transparent flex-1 appearance-none border border-gray-400 w-full py-2 px-4 bg-gray-100 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          inputErrorClass
        )}
        {...args}
        name={name}
        required={required}
      />
      {error && <label className="prose text-red-500 prose-sm">{error}</label>}
    </div>
  )
})
