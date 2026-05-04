import { AuthProvider } from '@Auth/application/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system'

export const UserAvatar = () => {
  const { user } = AuthProvider.useAuthValue()

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatar} alt={user.firstname} />
        <AvatarFallback className="rounded-lg">{`${user.firstname?.charAt(0)}${user.lastname?.charAt(0)}`}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.firstname}</span>
      </div>
    </div>
  )
}
