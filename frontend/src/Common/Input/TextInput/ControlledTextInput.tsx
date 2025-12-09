import { InputHTMLAttributes, ReactNode } from 'react'
import { ControllerFieldState } from 'react-hook-form'
import { BaseInputProps } from '../BaseInputProps.type'
import { Input } from '@/components/ui/input'
import { className as cn } from '@Common/utils/className'
import { useTestId } from '@Common/hooks/useTestId'

type Props = InputHTMLAttributes<unknown> &
  BaseInputProps & {
    label?: ReactNode
    fieldState: ControllerFieldState
    required?: boolean
    testId?: string
  }

export const ControlledTextInput = ({ label, fieldState, value, required, testId, ...props }: Props) => {
  const testIds = useTestId(testId, ['label', 'input', 'error'])

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 relative pb-6">
      <label
        htmlFor={props.name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        data-testid={testIds.label}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <Input {...props} value={value} required={required} data-testid={testIds.input} />
      <div
        className={cn(
          'text-sm text-red-500 absolute bottom-1 transition-[height] duration-300',
          fieldState.error ? 'h-4' : 'h-0'
        )}
        data-testid={testIds.error}
      >
        {fieldState.error ? fieldState.error.message : ''}
      </div>
    </div>
  )
}
