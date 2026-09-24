import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { User } from '../../domain/User'
import { AdminUserTableRow } from './AdminUserTableRow'

type AdminUserTableProps = {
  users: User[]
  /** Authenticated admin id, used to hide the delete action on their own row. */
  currentUserId?: string
  onEdit: (userId: string) => void
  onDelete: (user: User) => void
  onActivate: (userId: string) => void
  onUnblock: (userId: string) => void
}

export const AdminUserTable = ({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onActivate,
  onUnblock,
}: AdminUserTableProps) => (
  <Table>
    <TableHeader>
      <TableHead>
        <FormattedMessage id="adminUsers.table.name" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminUsers.table.email" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminUsers.table.roles" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminUsers.table.status" />
      </TableHead>
      <TableHead className="w-[180px]">
        <FormattedMessage id="adminUsers.table.actions" />
      </TableHead>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="adminUsers.table.empty" />
        </div>
      )}
    >
      {users.map(user => (
        <AdminUserTableRow
          key={user.id}
          user={user}
          isSelf={user.id === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
          onUnblock={onUnblock}
        />
      ))}
    </TableBody>
  </Table>
)
