import { AuthProvider } from '@Auth/application/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage, Button, cn } from '@repo/design-system'
import { type AvatarSize } from './types'

const getSizeClasses = (size: AvatarSize) => {
  switch (size) {
    case 'small':
      return 'h-6 w-6'
    case 'medium':
      return 'h-8 w-8'
    case 'large':
    default:
      return 'h-10 w-10'
  }
}

type UserAvartarButtonProps = {
  size: AvatarSize
}

export const UserAvatarButton = ({ size }: UserAvartarButtonProps) => {
  const { user } = AuthProvider.useAuthValue()

  const sizeClass = getSizeClasses(size)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('cursor-pointer rounded-full p-0', sizeClass)}
      aria-label="User menu"
    >
      <Avatar className={cn('rounded-lg', sizeClass)}>
        <AvatarImage src={user?.avatar} alt={user?.firstname} />
        <AvatarFallback className="rounded-lg">{`${user?.firstname?.at(0)}${user?.lastname?.at(0)}`}</AvatarFallback>
      </Avatar>
    </Button>
  )
}
