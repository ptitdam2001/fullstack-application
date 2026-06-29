import { FormattedMessage } from 'react-intl'
import { Table } from '@Common/Table/Table'
import type { AgeCategory } from '../../domain/AgeCategory'
import { AdminAgeCategoryTableRow } from './AdminAgeCategoryTableRow'

type AdminAgeCategoryTableProps = {
  ageCategories: AgeCategory[]
  onEdit: (id: string) => void
  onDelete: (ageCategory: AgeCategory) => void
}

export const AdminAgeCategoryTable = ({ ageCategories, onEdit, onDelete }: AdminAgeCategoryTableProps) => (
  <Table.TableContainer>
    <Table.TableHeader>
      <Table.TableHead>
        <FormattedMessage id="adminAgeCategories.table.label" />
      </Table.TableHead>
      <Table.TableHead>
        <FormattedMessage id="adminAgeCategories.table.genre" />
      </Table.TableHead>
      <Table.TableHead size="120px">
        <FormattedMessage id="adminAgeCategories.table.actions" />
      </Table.TableHead>
    </Table.TableHeader>
    <Table.TableBody>
      {ageCategories.length === 0 ? (
        <Table.TableRow>
          <Table.TableCell colSpan={3} className="text-muted-foreground py-8 text-center">
            <FormattedMessage id="adminAgeCategories.table.empty" />
          </Table.TableCell>
        </Table.TableRow>
      ) : (
        ageCategories.map(ac => (
          <AdminAgeCategoryTableRow key={ac.id} ageCategory={ac} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </Table.TableBody>
  </Table.TableContainer>
)
