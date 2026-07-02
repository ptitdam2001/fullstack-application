import { cva } from 'class-variance-authority'

export const ColorSliderTrackVariants = cva('rounded-md', {
  variants: {
    orientation: {
      horizontal: 'col-span-2 h-6 w-full',
      vertical: 'h-50 w-6',
    },
    isDisabled: {
      true: 'bg-neutral-300 dark:bg-neutral-800',
    },
  },
})
