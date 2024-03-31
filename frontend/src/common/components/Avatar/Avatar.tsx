import { memo } from 'react'
import { UserOutlined } from '@Common/components/Icon'
import { styled } from 'styled-components'
import tw from 'twin.macro'
import { AvatarImgProps, AvatarProps } from './types'

const AvatarImg = styled.img<AvatarImgProps>(({ size, shape = 'circle' }: AvatarImgProps) => [
  `height: ${size ?? 16}px;`,
  `width: ${size ?? 16}px;`,
  `color: black;`,
  shape === 'circle' && tw`rounded-full`,
  shape === 'square' && tw`rounded`,
])

const Avatar = ({
  size = 32,
  shape = 'circle',
  icon = <UserOutlined />,
  imgSrc,
  text,
  'data-testid': testId,
  onClick,
}: AvatarProps) => {
  return imgSrc ? (
    <AvatarImg
      src={imgSrc}
      alt={text}
      size={size}
      shape={shape}
      data-testid={testId && `${testId}--img`}
      onClick={onClick}
    />
  ) : (
    <figure style={{ width: size, height: size }} data-testid={testId && `${testId}--icon`} onClick={onClick}>
      {icon}
    </figure>
  )
}

export default memo(Avatar)
