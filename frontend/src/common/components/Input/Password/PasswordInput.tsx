import classNames from 'classnames'
import React, { memo, useCallback, useState } from 'react'
import { BaseInputProps } from '../types'
import { TextInput } from '../Text'
import { CloseEye, OpenEye } from '@Common/components/Icon'

export interface PasswordInputProps extends BaseInputProps {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, error, ...args }, ref) => {
  const [show, setShow] = useState<boolean>(false)

  const toogleIconClass = classNames('h-5 w-5', { 'fill-red-500': error })

  const handleToggleMode = useCallback(() => setShow(oldValue => !oldValue), [setShow])

  return (
    <div className={classNames('relative', className)}>
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
})
export default memo(PasswordInput)
