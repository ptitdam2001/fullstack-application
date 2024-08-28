import { BaseInputProps } from './types'
import React from 'react'
import { TextInput } from './Text/TextInput'

export type EmailInputProps = BaseInputProps

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>((args, ref) => (
  <TextInput ref={ref} {...args} htmlType="email" />
))
