import { cva } from 'class-variance-authority'

export const listVariants = cva('overflow-auto w-full bg-background text-foreground outline-none', {
  variants: {
    variant: {
      default: 'border rounded-md',
      ghost: '',
    },
  },
  defaultVariants: { variant: 'default' },
})
