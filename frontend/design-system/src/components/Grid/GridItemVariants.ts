import { cva } from 'class-variance-authority'

export const gridItemVariants = cva(
  'relative cursor-default select-none rounded-sm outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-hovered:ring-2 data-hovered:ring-ring data-focused:ring-2 data-focused:ring-ring data-selected:ring-2 data-selected:ring-primary',
)
