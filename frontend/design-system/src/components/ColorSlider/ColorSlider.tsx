import { ColorSlider as AriaColorSlider, SliderOutput, SliderTrack, composeRenderProps } from 'react-aria-components'
import type { ColorSliderProps as AriaColorSliderProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { Label } from '../Label/Label'
import { ColorThumb } from '../ColorThumb/ColorThumb'
import { ColorSliderTrackVariants } from './ColorSliderVariants'

type ColorSliderProps = AriaColorSliderProps & {
  label?: string
}

export const ColorSlider = ({ label, className, ...props }: ColorSliderProps) => (
  <AriaColorSlider
    data-slot="color-slider"
    {...props}
    className={composeRenderProps(className, cls =>
      cn(
        'group flex flex-col items-center gap-2 font-sans',
        'data-[orientation=horizontal]:grid data-[orientation=horizontal]:w-56 data-[orientation=horizontal]:grid-cols-[1fr_auto]',
        cls
      )
    )}
  >
    {label && <Label>{label}</Label>}
    <SliderOutput className="text-muted-foreground group-data-[orientation=vertical]:hidden text-sm font-medium" />
    <SliderTrack
      className={renderProps =>
        cn(ColorSliderTrackVariants({ orientation: renderProps.orientation, isDisabled: renderProps.isDisabled }))
      }
      style={({ defaultStyle, isDisabled }) => ({
        ...defaultStyle,
        background: isDisabled
          ? undefined
          : `${defaultStyle.background}, repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      })}
    >
      <ColorThumb />
    </SliderTrack>
  </AriaColorSlider>
)
