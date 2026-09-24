import { Badge, Button, TableRow, TableCell } from '@repo/design-system'
import { Pencil, Trash2, UserCheck, Unlock } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { User } from '../../domain/User'

type UserStatus = 'active' | 'pending' | 'blocked'

const statusVariant = {
  active: 'default',
  pending: 'secondary',
  blocked: 'destructive',
} as const satisfies Record<UserStatus, 'default' | 'secondary' | 'destructive'>

const getUserStatus = (user: User): UserStatus => {
  if (user.isBlocked) {
    return 'blocked'
  }

  if (user.isActive) {
    return 'active'
  }

  return 'pending'
}

type AdminUserTableRowProps = {
  user: User
  /** The row is the authenticated admin — self-deletion is refused by the API, so the action is hidden. */
  isSelf: boolean
  onEdit: (userId: string) => void
  onDelete: (user: User) => void
  onActivate: (userId: string) => void
  onUnblock: (userId: string) => void
}

export const AdminUserTableRow = ({
  user,
  isSelf,
  onEdit,
  onDelete,
  onActivate,
  onUnblock,
}: AdminUserTableRowProps) => {
  const intl = useIntl()
  const status = getUserStatus(user)
  const roles = user.roles ?? []

  return (
    <TableRow id={user.id}>
      <TableCell className="font-medium">{[user.firstName, user.lastName].filter(Boolean).join(' ')}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {roles.map(role => (
              <Badge key={role} variant="outline">
                <FormattedMessage id={`adminUsers.role.${role}`} />
              </Badge>
            ))}
          </div>
        ) : (
          '—'
        )}
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant[status]} data-testid="user-status" data-status={status}>
          <FormattedMessage id={`adminUsers.status.${status}`} />
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {!user.isActive && (
            <Button
              variant="outline"
              size="icon"
              aria-label={intl.formatMessage({ id: 'adminUsers.action.activate' })}
              onPress={() => onActivate(user.id)}
            >
              <UserCheck className="h-4 w-4" />
            </Button>
          )}
          {user.isBlocked && (
            <Button
              variant="outline"
              size="icon"
              aria-label={intl.formatMessage({ id: 'adminUsers.action.unblock' })}
              onPress={() => onUnblock(user.id)}
            >
              <Unlock className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminUsers.action.edit' })}
            onPress={() => onEdit(user.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {!isSelf && (
            <Button
              variant="outline"
              size="icon"
              aria-label={intl.formatMessage({ id: 'adminUsers.action.delete' })}
              onPress={() => onDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
