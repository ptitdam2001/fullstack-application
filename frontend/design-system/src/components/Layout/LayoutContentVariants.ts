import { cva } from 'class-variance-authority'

export const LayoutContentVariants = cva('overflow-y-auto overflow-x-hidden flex-1 min-h-0 flex flex-col', {
  variants: {
    align: {
      stretch: 'items-stretch',
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: { align: 'stretch' },
})
