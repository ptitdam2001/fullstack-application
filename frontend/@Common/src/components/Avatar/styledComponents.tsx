import { styled } from 'styled-components'
import tw from 'twin.macro'
import { AvatarImgProps } from './types'

export const AvatarImg = styled.img<AvatarImgProps>(({ size, shape = 'circle' }: AvatarImgProps) => [
  `height: ${size};`,
  `width: ${size};`,
  `color: black;`,
  shape === 'circle' && tw`rounded-full`,
  shape === 'square' && tw`rounded`,
])
