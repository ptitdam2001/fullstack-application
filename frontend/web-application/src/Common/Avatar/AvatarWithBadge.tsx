import { ReactNode } from 'react'
import { className as cn } from '@Common/utils/className'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
`

type BaseImageInfo = {
  label?: string
  url?: string
  content?: ReactNode
  className?: string
}

type AvatarWithBadgeProps = {
  badge: BaseImageInfo
  avatar: BaseImageInfo
  size?: 'sm' | 'md' | 'lg'
}

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({ badge, avatar, size = 'md' }) => (
  <Container>
    <Avatar
      className={cn(avatar.className, { 'size-10': size === 'sm', 'size-14': size === 'md', 'size-18': size === 'lg' })}
    >
      <AvatarImage src={avatar.url} alt={avatar.label} />
      <AvatarFallback>{avatar.label}</AvatarFallback>
    </Avatar>
    <Badge className="absolute -bottom-2 -right-2 rounded-full bg-primary p-0">
      <Avatar
        className={cn(badge.className, {
          'size-4': size === 'sm',
          'size-6': size === 'md',
          'size-8': size === 'lg',
        })}
      >
        <AvatarImage src={badge.url} alt={badge.label} />
        <AvatarFallback>{badge.content}</AvatarFallback>
      </Avatar>
    </Badge>
  </Container>
)
