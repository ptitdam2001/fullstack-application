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

export const PasswordInput = ({
  className,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  ...props
}: PasswordInputProps) => {
  const [show, setShow] = useState(false)

  return (
    <div data-slot="password-input" className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className={cn('pr-10', className)} />
      <AriaButton
        className="text-muted-foreground hover:text-foreground pressed:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        type="button"
        onPress={() => setShow(v => !v)}
        aria-label={show ? hidePasswordLabel : showPasswordLabel}
      >
        {show ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
      </AriaButton>
    </div>
  )
}
