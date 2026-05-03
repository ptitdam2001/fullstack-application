import { TextArea as AriaTextArea } from 'react-aria-components'
import type { TextAreaProps as AriaTextAreaProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TextareaProps = AriaTextAreaProps

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <AriaTextArea
    data-slot="textarea"
    className={cn(
      'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none resize-y disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      className
    )}
    {...props}
  />
)
