import { cva } from 'class-variance-authority'

export const typographyColorVariants = cva('', {
  variants: {
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})