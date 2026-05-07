import { cva } from 'class-variance-authority'

export const listItemVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-hovered:bg-accent data-hovered:text-accent-foreground data-focused:bg-accent data-focused:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground',
)
