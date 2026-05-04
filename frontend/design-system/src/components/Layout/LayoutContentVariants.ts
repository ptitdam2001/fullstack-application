import { cva } from 'class-variance-authority'

export const LayoutContentVariants = cva('min-h-0 flex-1 overflow-auto flex flex-col', {
  variants: {
    align: {
      stretch: 'items-stretch',
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: { align: 'stretch' },
})
