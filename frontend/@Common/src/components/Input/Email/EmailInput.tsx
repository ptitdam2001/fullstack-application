import { BaseInputProps } from '../types'
import React, { memo } from 'react'
import { TextInput } from '../Text'

export type EmailInputProps = BaseInputProps

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>((args, ref) => (
  <TextInput ref={ref} {...args} htmlType="email" />
))

export default memo(EmailInput)
