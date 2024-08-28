import { memo, useMemo } from 'react'
import { UserOutlined } from '@Components/Icon'
import { AvatarProps } from './types'
import { AvatarImg } from './styledComponents'

export const Avatar = memo(
  ({ size = '2rem', shape = 'circle', icon = <UserOutlined />, imgSrc, text, testId, onClick }: AvatarProps) => {
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
)
