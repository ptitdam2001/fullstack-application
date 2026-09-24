import { Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, Separator, TablePagination, Typography } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { type User, useUserListSuspense } from '@User'
import { AdminUserTable } from '@User/ui/Admin/AdminUserTable'
import { AdminUserFormSheet } from '@User/ui/Admin/AdminUserFormSheet'
import { ConfirmUserActionDialog, type UserAction } from '@User/ui/Admin/ConfirmUserActionDialog'
import { userFullName } from '@User/ui/Admin/userFullName'
import { useAdminUsersPage } from './useAdminUsersPage'

type AdminUserListContentProps = {
  currentUserId?: string
  onEdit: (user: User) => void
  onAction: (action: UserAction, user: User) => void
}

const AdminUserListContent = ({ currentUserId, onEdit, onAction }: AdminUserListContentProps) => {
  const { query, countQuery, pagination, changePage, isPending } = useUserListSuspense(25)
  const users = query.data
  // Activate/unblock/edit rows only expose the id: resolve it back to the row shown
  const byId = (id: string) => users.find(user => user.id === id)
  const withUser = (handler: (user: User) => void) => (id: string) => {
    const user = byId(id)
    if (user) {
      handler(user)
    }
  }

  return (
    <section className="flex h-full w-full flex-col gap-0.5" aria-busy={isPending}>
      <div className={`transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <AdminUserTable
          users={users}
          currentUserId={currentUserId}
          onEdit={withUser(onEdit)}
          onDelete={user => onAction('delete', user)}
          onActivate={withUser(user => onAction('activate', user))}
          onUnblock={withUser(user => onAction('unblock', user))}
        />
      </div>
      <div className="min-h-10">
        <TablePagination
          count={countQuery.data}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AdminUsersPage = () => {
  const page = useAdminUsersPage()
  const { sheet, confirm } = page

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminUsers.title" />
          </Typography.Title1>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={5} nbRows={10} />}>
            <AdminUserListContent
              currentUserId={page.currentUserId}
              onEdit={page.openEdit}
              onAction={page.askConfirm}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
      <AdminUserFormSheet
        open={sheet.open}
        onOpenChange={page.closeSheet}
        user={sheet.user}
        isSelf={sheet.user?.id === page.currentUserId}
      />
      {confirm.action && confirm.user && (
        <ConfirmUserActionDialog
          action={confirm.action}
          userName={userFullName(confirm.user)}
          open={confirm.open}
          onOpenChange={page.closeConfirm}
          onConfirm={page.handleConfirm}
          isPending={page.isConfirmPending}
        />
      )}
    </Layout.Root>
  )
}
