import { useState } from 'react'
import { Button as AriaButton } from 'react-aria-components'
import type { InputProps as AriaInputProps } from 'react-aria-components'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../Input/Input'
import { cn } from '../../utils/cn'

type PasswordInputProps = Omit<AriaInputProps, 'type'> & {
  showPasswordLabel?: string
  hidePasswordLabel?: string
}

export const PasswordInput = (allProps: PasswordInputProps) => {
  const {
    className,
    showPasswordLabel = 'Show password',
    hidePasswordLabel = 'Hide password',
    value,
    ...props
  } = allProps
  const [show, setShow] = useState(false)
  // Controlled as soon as the caller passes the `value` prop, even undefined (a react-hook-form field
  // without a default value). Without the prop the input is uncontrolled and honours defaultValue.
  const controlledValue = 'value' in allProps ? (value ?? '') : undefined

  return (
    <div data-slot="password-input" className="relative">
      <Input {...props} value={controlledValue} type={show ? 'text' : 'password'} className={cn('pr-10', className)} />
      <AriaButton
        className="text-muted-foreground hover:text-foreground pressed:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors outline-none focus-visible:ring-2"
        type="button"
        onPress={() => setShow(v => !v)}
        aria-label={show ? hidePasswordLabel : showPasswordLabel}
      >
        {show ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
      </AriaButton>
    </div>
  )
}
