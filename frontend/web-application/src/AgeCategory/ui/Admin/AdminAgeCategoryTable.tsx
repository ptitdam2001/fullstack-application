import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import type { AgeCategory } from '../../domain/AgeCategory'
import { AdminAgeCategoryTableRow } from './AdminAgeCategoryTableRow'

type AdminAgeCategoryTableProps = {
  ageCategories: AgeCategory[]
  onEdit: (id: string) => void
  onDelete: (ageCategory: AgeCategory) => void
}

export const AdminAgeCategoryTable = ({ ageCategories, onEdit, onDelete }: AdminAgeCategoryTableProps) => (
  <Table>
    <TableHeader>
      <TableHead>
        <FormattedMessage id="adminAgeCategories.table.label" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="adminAgeCategories.table.genre" />
      </TableHead>
      <TableHead className="w-[120px]">
        <FormattedMessage id="adminAgeCategories.table.actions" />
      </TableHead>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="adminAgeCategories.table.empty" />
        </div>
      )}
    >
      {ageCategories.map(ac => (
        <AdminAgeCategoryTableRow key={ac.id} ageCategory={ac} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </TableBody>
  </Table>
)
