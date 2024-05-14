import { memo, useMemo } from 'react'
import { UserOutlined } from '@Common/components/Icon'
import { styled } from 'styled-components'
import tw from 'twin.macro'
import { AvatarImgProps, AvatarProps } from './types'

const AvatarImg = styled.img<AvatarImgProps>(({ size, shape = 'circle' }: AvatarImgProps) => [
  `height: ${size};`,
  `width: ${size};`,
  `color: black;`,
  shape === 'circle' && tw`rounded-full`,
  shape === 'square' && tw`rounded`,
])

const Avatar = ({
  size = '2rem',
  shape = 'circle',
  icon = <UserOutlined />,
  imgSrc,
  text,
  'data-testid': testId,
  onClick,
}: AvatarProps) => {
  const finalSize = useMemo(() => {
    if (typeof size === 'number') {
      return `${size}px`
    } else if (typeof size === 'string' && (size.endsWith('rem') || size.endsWith('px'))) {
      return size
    } else {
      throw new Error('bad size format')
    }
  }, [size])

  return imgSrc ? (
    <AvatarImg
      src={imgSrc}
      alt={text}
      size={finalSize}
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
