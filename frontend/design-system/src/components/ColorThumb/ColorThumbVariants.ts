import { cva } from 'class-variance-authority'

export const ColorThumbVariants = cva('top-[50%] left-[50%] size-[18px] rounded-full border-2 border-white box-border', {
  variants: {
    isFocusVisible: {
      true: 'size-8',
    },
    isDragging: {
      true: 'bg-neutral-700 dark:bg-neutral-300',
    },
    isDisabled: {
      true: 'border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800',
    },
  },
})
