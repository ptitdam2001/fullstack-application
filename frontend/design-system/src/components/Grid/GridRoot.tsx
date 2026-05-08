import { ListBox, type ListBoxProps, GridLayout, type GridLayoutOptions, Virtualizer } from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { gridVariants } from './GridVariants'

type SizeLike = { width: number; height: number }
type GridLayoutOptionsInput = Omit<GridLayoutOptions, 'minItemSize' | 'maxItemSize' | 'minSpace'> & {
  minItemSize?: SizeLike
  maxItemSize?: SizeLike
  minSpace?: SizeLike
}

export type GridRootProps<T extends object> = ListBoxProps<T> &
  VariantProps<typeof gridVariants> & {
    layoutOptions?: GridLayoutOptionsInput
  }

// GridLayout calls .equals() on Size objects — plain objects lack this method
const toSize = (s: SizeLike) => ({
  width: s.width,
  height: s.height,
  equals(other: SizeLike) {
    return this.width === other.width && this.height === other.height
  },
})

const toGridLayoutOptions = (opts: GridLayoutOptionsInput | undefined): GridLayoutOptions | undefined => {
  if (!opts) return undefined
  return {
    ...opts,
    ...(opts.minItemSize ? { minItemSize: toSize(opts.minItemSize) } : {}),
    ...(opts.maxItemSize ? { maxItemSize: toSize(opts.maxItemSize) } : {}),
    ...(opts.minSpace ? { minSpace: toSize(opts.minSpace) } : {}),
  } as GridLayoutOptions
}

export const GridRoot = <T extends object>({
  className,
  variant,
  layoutOptions,
  children,
  ...props
}: GridRootProps<T>) => (
  <Virtualizer layout={GridLayout} layoutOptions={toGridLayoutOptions(layoutOptions)}>
    <ListBox
      data-slot="grid"
      className={cn(
        gridVariants({ variant }),
        'scrollbar-thin scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500 block p-0',
        className
      )}
      {...props}
    >
      {children}
    </ListBox>
  </Virtualizer>
)
