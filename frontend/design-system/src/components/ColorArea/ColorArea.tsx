import { ColorArea as AriaColorArea, composeRenderProps } from 'react-aria-components'
import type { ColorAreaProps as AriaColorAreaProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { ColorThumb } from '../ColorThumb/ColorThumb'

type ColorAreaProps = AriaColorAreaProps

export const ColorArea = ({ className, ...props }: ColorAreaProps) => (
  <AriaColorArea
    data-slot="color-area"
    {...props}
    className={composeRenderProps(className, cls =>
      cn('aspect-square w-full max-w-56 shrink-0 rounded-lg bg-neutral-300 dark:bg-neutral-800', cls)
    )}
    style={({ defaultStyle, isDisabled }) => ({
      ...defaultStyle,
      background: isDisabled ? undefined : defaultStyle.background,
    })}
  >
    <ColorThumb />
  </AriaColorArea>
)
