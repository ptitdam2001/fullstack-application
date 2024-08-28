import React, { useCallback, useState } from 'react'
import { BaseInputProps } from '../types'
import { TextInput } from '../Text/TextInput'
import { CloseEye, OpenEye } from '@Components/Icon'
import { classnameMerge } from '@Utils/classnames'

export type PasswordInputProps = BaseInputProps

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...args }, ref) => {
    const [show, setShow] = useState<boolean>(false)

    const toogleIconClass = classnameMerge('h-5 w-5', { 'fill-red-500': error })

    const handleToggleMode = useCallback(() => setShow(oldValue => !oldValue), [setShow])

    return (
      <div className={classnameMerge('relative', className)}>
        <TextInput
          ref={ref}
          {...args}
          htmlType={show ? 'text' : 'password'}
          error={error}
          preElement={
            <span onClick={handleToggleMode}>
              {show ? <OpenEye className={toogleIconClass} /> : <CloseEye className={toogleIconClass} />}
            </span>
          }
        />
      </div>
    )
  }
)
