import { BaseInputProps } from '../types'
import React, { ReactNode, useMemo } from 'react'
import { classnameMerge } from '@Utils/classnames'

export interface TextInputProps extends BaseInputProps {
  htmlType?: string
  preElement?: ReactNode
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const {
    label,
    id,
    name,
    className,
    error,
    required,
    disabled,
    borderless = false,
    htmlType = 'text',
    preElement,
    ...args
  } = props
  const inputId = id || name

  const classes = useMemo(
    () =>
      classnameMerge(
        'text-form-input',
        {
          'rounded-lg': !preElement,
          'rounded-l-lg': !!preElement,
        },
        'border',
        {
          'border-transparent': borderless,
          'border-red-700': !borderless && !!error,
          'border-gray-300': !borderless && disabled,
          'border-slate-400': !borderless && !disabled,
        },
        {
          'border-b-red-700 text-gray-700': !!error,
          'border-b-gray-300 bg-gray-100/50 text-gray-300': disabled === true,
          'border-b-indigo-500 bg-gray-100/50 text-gray-700': !error && !disabled,
        },
        'text-base',
        'flex-1 appearance-none w-full py-2 px-4 placeholder-gray-400 shadow-sm',
        'focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-transparent'
      ),
    [preElement, borderless, error, disabled]
  )
  const preElementClass = useMemo(
    () =>
      classnameMerge(
        'border',
        'rounded-r-lg',
        'border-l-0',
        'inline-flex items-center px-3',
        {
          'border-transparent': borderless,
          'border-red-700': !borderless && !!error,
          'border-gray-300': !borderless && disabled,
          'border-slate-400': !borderless && !disabled,
        },
        {
          'border-b-red-700 text-gray-700': !!error,
          'border-b-gray-300 bg-gray-100/50 text-gray-300': disabled === true,
          'border-b-indigo-500 bg-gray-100/50 text-gray-700': !error && !disabled,
        }
      ),
    [borderless, error, disabled]
  )

  return (
    <section className={classnameMerge('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="text-gray-500 text-sm">
          {label}
          {required && <span className="text-red-500 required-dot">*</span>}
        </label>
      )}
      <div className="flex">
        <input
          ref={ref}
          id={inputId}
          type={htmlType}
          className={classes}
          {...args}
          name={name}
          required={required}
          disabled={disabled}
        />
        {preElement && <span className={preElementClass}>{preElement}</span>}
      </div>
      {error && <label className="prose text-red-500 prose-sm">{error}</label>}
    </section>
  )
})
