import { ColorThumb as AriaColorThumb, composeRenderProps } from 'react-aria-components'
import type { ColorThumbProps as AriaColorThumbProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { ColorThumbVariants } from './ColorThumbVariants'

type ColorThumbProps = AriaColorThumbProps

export const ColorThumb = ({ className, ...props }: ColorThumbProps) => (
  <AriaColorThumb
    data-slot="color-thumb"
    {...props}
    style={renderProps => ({
      ...renderProps.defaultStyle,
      backgroundColor: renderProps.isDisabled ? undefined : renderProps.defaultStyle.backgroundColor,
      boxShadow: '0 0 0 1px black, inset 0 0 0 1px black',
    })}
    className={composeRenderProps(className, (cls, renderProps) =>
      cn(
        ColorThumbVariants({
          isFocusVisible: renderProps.isFocusVisible,
          isDragging: renderProps.isDragging,
          isDisabled: renderProps.isDisabled,
        }),
        cls
      )
    )}
  />
)
