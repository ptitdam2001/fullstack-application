import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { ReactNode } from 'react'
import { className as cn } from '@Common/utils/className'

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.primary.main}`,
  fontSize: '0.8em',
  color: '#fff',
  background: theme.palette.primary.main,
}))

type BaseImageInfo = {
  label?: string
  url?: string
  content?: ReactNode
  className?: string
}

type AvatarWithBadgeProps = {
  badge: BaseImageInfo
  avatar: BaseImageInfo
}

export const AvatarWithBadge = ({ badge, avatar }: AvatarWithBadgeProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <SmallAvatar alt={badge.label} src={badge.url}>
            {badge.content}
          </SmallAvatar>
        }
      >
        <Avatar alt={avatar.label} src={avatar.url} className={cn(avatar.className)}>
          {avatar.content}
        </Avatar>
      </Badge>
    </Stack>
  )
}
