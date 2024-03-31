import { ReactElement, memo } from 'react'
import { UserOutlined } from '@Common/components/Icon'
import { styled } from 'styled-components'
import tw from 'twin.macro'

type AvatarProps = {
  size?: number
  shape?: 'square' | 'circle'
  imgSrc?: string
  text?: string
  icon?: ReactElement
}

type AvatarImgProps = {
  readonly size: number
  readonly shape?: 'square' | 'circle'
}

const AvatarImg = styled.img<AvatarImgProps>(({ size, shape = 'circle' }: AvatarImgProps) => [
  `height: ${size ?? 16}px;`,
  `width: ${size ?? 16}px;`,
  `color: black;`,
  shape === 'circle' && tw`rounded-full`,
  shape === 'square' && tw`rounded`,
])

const Avatar = ({ size = 32, shape = 'circle', icon = <UserOutlined />, imgSrc, text }: AvatarProps) => {
  return imgSrc ? (
    <AvatarImg src={imgSrc} alt={text} size={size} shape={shape} />
  ) : (
    <div style={{ width: size, height: size }}>{icon}</div>
  )
}

export default memo(Avatar)
