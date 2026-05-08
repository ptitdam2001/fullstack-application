import { cva } from 'class-variance-authority'

export const gridVariants = cva('overflow-y-auto overflow-x-hidden w-full bg-background text-foreground outline-none', {
  variants: {
    variant: {
      default: 'border rounded-md',
      ghost: '',
    },
  },
  defaultVariants: { variant: 'default' },
})
